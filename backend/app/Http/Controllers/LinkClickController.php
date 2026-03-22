<?php

namespace App\Http\Controllers;

use App\Models\LinkClick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LinkClickController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
            'text' => 'nullable|string',
        ]);

        LinkClick::create([
            'user_id' => Auth::id(),
            'url' => $request->url,
            'text' => $request->text,
            'clicked_at' => now(),
        ]);

        return response()->json(['message' => 'Click tracked successfully']);
    }
}
