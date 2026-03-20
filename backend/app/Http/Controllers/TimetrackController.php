<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class TimetrackController extends Controller
{
    public function redirect(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect('/')->with('error', 'Authentication required.');
        }

        // Note: Timetrack cookies (pep_cook and cv_uid) are now set during sign-in 
        // in AuthController to ensure they are available immediately.
        
        return redirect('https://pep.mypricol.in/timetrack');
    }
}
