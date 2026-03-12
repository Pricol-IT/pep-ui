<?php

namespace App\Http\Controllers;

use App\Models\AccessRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * List all pending access requests.
     */
    public function index()
    {
        // Ensure user is admin or superadmin
        if (!Auth::user()->hasRole(['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $requests = AccessRequest::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    /**
     * Submit an access request for the authenticated user.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if already has a pending request
        $existing = AccessRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already have a pending request.'], 409);
        }

        $accessRequest = AccessRequest::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'requested_role' => 'hr', // Default to HR for now
        ]);

        return response()->json($accessRequest, 201);
    }

    /**
     * Check the status of the user's access request.
     */
    public function checkStatus()
    {
        $user = Auth::user();
        $request = AccessRequest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json($request);
    }

    /**
     * Approve an access request.
     */
    public function approve($id)
    {
        if (!Auth::user()->hasRole(['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $accessRequest = AccessRequest::findOrFail($id);
        
        if ($accessRequest->status !== 'pending') {
            return response()->json(['message' => 'Request is not pending.'], 400);
        }

        $accessRequest->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
        ]);

        // Update the user's role
        $user = User::find($accessRequest->user_id);
        $user->role = $accessRequest->requested_role;
        $user->save();

        return response()->json(['message' => 'Request approved and role assigned.']);
    }

    /**
     * Reject an access request.
     */
    public function reject($id)
    {
        if (!Auth::user()->hasRole(['admin', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $accessRequest = AccessRequest::findOrFail($id);

        if ($accessRequest->status !== 'pending') {
            return response()->json(['message' => 'Request is not pending.'], 400);
        }

        $accessRequest->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Request rejected.']);
    }
}
