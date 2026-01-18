<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CalendarController extends Controller
{
    /**
     * Get upcoming meetings from Microsoft Graph.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->azure_token) {
            return response()->json(['error' => 'No Microsoft account linked.'], 401);
        }

        // Check if token is expired
        if ($user->azure_token_expires_at && Carbon::parse($user->azure_token_expires_at)->isPast()) {
            // In a real app, we'd use the refresh token here.
            // For now, let's just return error or try to re-auth.
            return response()->json(['error' => 'Microsoft token expired. Please log in again.'], 401);
        }

        try {
            $response = Http::withToken($user->azure_token)
                ->get('https://graph.microsoft.com/v1.0/me/events', [
                    '$select' => 'subject,start,end,location,onlineMeetingUrl',
                    '$orderby' => 'start/dateTime ASC',
                    '$filter' => 'start/dateTime ge \'' . now()->toIso8601String() . '\'',
                    '$top' => 5
                ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Failed to fetch meetings from Microsoft Graph',
                    'details' => $response->json()
                ], $response->status());
            }

            $events = $response->json()['value'];

            // Transform data for the frontend
            $meetings = collect($events)->map(function ($event) {
                return [
                    'id' => $event['id'],
                    'title' => $event['subject'],
                    'time' => Carbon::parse($event['start']['dateTime'])->setTimezone('Asia/Kolkata')->format('h:i A'),
                    'type' => $event['onlineMeetingUrl'] ? 'online' : 'office',
                    'location' => $event['location']['displayName'] ?? 'TBD'
                ];
            });

            return response()->json($meetings);

        } catch (\Exception $e) {
            return response()->json(['error' => 'API Error: ' . $e->getMessage()], 500);
        }
    }
}
