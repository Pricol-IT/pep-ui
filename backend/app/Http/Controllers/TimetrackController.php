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

        try {
            // Find employee info from common_db
            $employee = DB::connection('common_db')
                ->table('GroupEmployeeInfo')
                ->where('official_mail_id', $user->email)
                ->first();

            if (!$employee) {
                return redirect('/')->with('error', 'Employee information not found.');
            }

            // Prepare cookie values
            $cid = $employee->company_id; // Mapping cmpid
            $eid = $employee->emp_code;   // Mapping empcode
            $altcode = $employee->alternate_code; // Mapping altcode

            // ASP.NET dictionary cookie is usually URL encoded as key=value&key=value
            $pepCookValue = "HRUser=NA&cmpid={$cid}&empcode={$eid}";

            // Set cookies for .mypricol.in domain
            // Cookie::make(name, value, minutes, path, domain, secure, httpOnly, raw)
            // Using raw=true (8th param) so Laravel doesn't URL-encode the "=" and "&" which ASP.NET expects unencoded for dictionary cookies
            $pepCookie = Cookie::make('pep_cook', $pepCookValue, 60, '/', '.mypricol.in', false, false, true);
            $cvUidCookie = Cookie::make('cv_uid', $altcode, 60, '/', '.mypricol.in', false, false, true);

            return redirect('https://pep.mypricol.in/timetrack')
                ->withCookie($pepCookie)
                ->withCookie($cvUidCookie);

        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Failed to retrieve employee data for Timetrack.');
        }
    }
}
