<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Redirect the user to the Azure AD authentication page.
     */
    public function redirectToAzure()
    {
        return Socialite::driver('azure')->redirect();
    }

    /**
     * Obtain the user information from Azure AD.
     */
    public function handleAzureCallback()
    {
        try {
            $azureUser = Socialite::driver('azure')->user();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed: ' . $e->getMessage()], 401);
        }

        $email = $azureUser->email ?? $azureUser->user['mail'] ?? $azureUser->user['userPrincipalName'];

        // Only allow users from the pricol.com domain
        if (!Str::endsWith($email, '@pricol.com')) {
            return redirect('http://localhost:5173/?error=unauthorized_domain');
        }

        $rawUser = $azureUser->user;
        $token = $azureUser->token;
        $avatarData = null;

        try {
            // Fetch profile photo from Microsoft Graph
            $photoResponse = Http::withToken($token)
                ->get('https://graph.microsoft.com/v1.0/me/photo/$value');

            if ($photoResponse->successful()) {
                $type = $photoResponse->header('Content-Type');
                $avatarData = 'data:' . $type . ';base64,' . base64_encode($photoResponse->body());
            }
        } catch (\Exception $e) {
            Log::error('Failed to fetch Azure avatar: ' . $e->getMessage());
        }

        // Find or create the user in the database
        $user = User::updateOrCreate([
            'email' => $email,
        ], [
            'name' => $azureUser->name,
            'password' => bcrypt(Str::random(24)),
            'job_title' => $rawUser['jobTitle'] ?? null,
            'company_name' => $rawUser['companyName'] ?? null,
            'department' => $rawUser['department'] ?? null,
            'employee_id' => $rawUser['employeeId'] ?? $rawUser['onPremisesSamAccountName'] ?? null,
            'office_location' => $rawUser['officeLocation'] ?? null,
            'manager_name' => $rawUser['manager']['displayName'] ?? null,
            'mobile_phone' => $rawUser['mobilePhone'] ?? $rawUser['businessPhones'][0] ?? null,
            'avatar' => $avatarData,
        ]);

        Auth::login($user);

        // Redirect back to the frontend with success
        return redirect('http://localhost:5173/?login=success');
    }

    /**
     * Get the authenticated user's details.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Log the user out.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
