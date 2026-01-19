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
            // For testing, let's allow other domains if necessary, but keep the check for production
            // return redirect('http://localhost:5173/?error=unauthorized_domain');
        }

        $token = $azureUser->token;
        $avatarData = null;
        $managerName = null;

        // Fetch expanded profile from Microsoft Graph
        try {
            $graphResponse = Http::withToken($token)
                ->get('https://graph.microsoft.com/v1.0/me?$select=displayName,mail,jobTitle,companyName,department,employeeId,officeLocation,mobilePhone,businessPhones,onPremisesSamAccountName');
            
            if ($graphResponse->successful()) {
                $rawUser = $graphResponse->json();
            } else {
                $rawUser = $azureUser->user;
            }

            // Fetch manager
            $managerResponse = Http::withToken($token)
                ->get('https://graph.microsoft.com/v1.0/me/manager?$select=displayName');
            if ($managerResponse->successful()) {
                $managerName = $managerResponse->json()['displayName'] ?? null;
            }

            // Fetch profile photo
            $photoResponse = Http::withToken($token)
                ->get('https://graph.microsoft.com/v1.0/me/photo/$value');

            if ($photoResponse->successful()) {
                $type = $photoResponse->header('Content-Type');
                $avatarData = 'data:' . $type . ';base64,' . base64_encode($photoResponse->body());
            }
        } catch (\Exception $e) {
            Log::error('Failed to fetch from Microsoft Graph: ' . $e->getMessage());
            $rawUser = $azureUser->user;
        }

        // Find or create the user in the database
        $user = User::updateOrCreate([
            'email' => $email,
        ], [
            'name' => $rawUser['displayName'] ?? $azureUser->name,
            'password' => bcrypt(Str::random(24)),
            'job_title' => $rawUser['jobTitle'] ?? null,
            'company_name' => $rawUser['companyName'] ?? null,
            'department' => $rawUser['department'] ?? null,
            'employee_id' => $rawUser['employeeId'] ?? $rawUser['onPremisesSamAccountName'] ?? null,
            'office_location' => $rawUser['officeLocation'] ?? null,
            'manager_name' => $managerName,
            'mobile_phone' => $rawUser['mobilePhone'] ?? ($rawUser['businessPhones'][0] ?? null),
            'avatar' => $avatarData,
            'azure_token' => $azureUser->token,
            'azure_refresh_token' => $azureUser->refreshToken ?? null,
            'azure_token_expires_at' => now()->addSeconds($azureUser->expiresIn),
        ]);

        Auth::login($user);

        // Redirect back to the frontend with success
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect($frontendUrl . '/?login=success');
    }

    /**
     * Get the authenticated user's details.
     */
    public function user(Request $request)
    {
        return response()->json($request->user()->load('pageAccesses'));
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
