<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of all announcements (for admin).
     */
    public function index()
    {
        return Announcement::with('creator')->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get the currently active announcement for display.
     */
    public function getActive()
    {
        $now = Carbon::now();
        
        $announcement = Announcement::where('is_active', true)
            ->where(function ($query) use ($now) {
                $query->whereNull('start_date')
                      ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('end_date')
                      ->orWhere('end_date', '>=', $now);
            })
            ->orderBy('updated_at', 'desc')
            ->first();

        return response()->json($announcement);
    }

    /**
     * Store a newly created announcement in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'badge_text' => 'nullable|string',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $validated['created_by'] = Auth::id();

        $announcement = Announcement::create($validated);

        return response()->json($announcement, 201);
    }

    /**
     * Update the specified announcement in storage.
     */
    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'content' => 'sometimes|required|string',
            'badge_text' => 'nullable|string',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $announcement->update($validated);

        return response()->json($announcement);
    }

    /**
     * Toggle the active status of an announcement.
     */
    public function toggle(Announcement $announcement)
    {
        $announcement->update(['is_active' => !$announcement->is_active]);
        return response()->json($announcement);
    }

    /**
     * Remove the specified announcement from storage.
     */
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}
