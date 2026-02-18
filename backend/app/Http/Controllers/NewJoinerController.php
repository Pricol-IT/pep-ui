<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NewJoinerController extends Controller
{
    public function index(Request $request)
    {
        // Define "New Joiner" as joined within the last 7 days from today
        $today = Carbon::today();
        $oneWeekAgo = Carbon::today()->subDays(7);

        try {
            $employees = DB::connection('common_db')
                ->table('GroupEmployeeInfo')
                ->select([
                    'emp_code', 
                    'emp_name', 
                    'doj', 
                    'designation_name', 
                    'department_name', 
                    'company_name',
                    'official_mail_id',
                    'status'
                ])
                ->where('status', 'A')
                ->whereBetween('doj', [$oneWeekAgo->format('Y-m-d'), $today->format('Y-m-d')])
                ->orderBy('doj', 'desc')
                ->get();

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch new joiners', 'message' => $e->getMessage()], 500);
        }

        $response = [];

        foreach ($employees as $emp) {
            $doj = Carbon::parse($emp->doj);
            
            $isToday = $doj->isToday();
            
            // Format "Joined today", "Joined this week", etc.
            if ($isToday) {
                $joinedText = "Joined today";
            } else {
                // E.g. "Joined 3 days ago" or just "Joined {Date}"
                // User request said "Joined this week". 
                // Let's use "Joined on {Date}" or "Joined {Day}"
                // The mock data had "Joined today" and "Joined this week".
                $joinedText = "Joined " . $doj->diffForHumans();
            }

            $response[] = [
                'id' => $emp->emp_code,
                'name' => $emp->emp_name,
                'designation' => $emp->designation_name,
                'department' => $emp->department_name,
                'company' => $emp->company_name,
                'doj' => $doj->format('Y-m-d'),
                'joinedDate' => $joinedText,
                'email' => $emp->official_mail_id,
                'initials' => $this->getInitials($emp->emp_name),
            ];
        }

        return response()->json($response);
    }

    private function getInitials($name)
    {
        $words = explode(' ', $name);
        $initials = '';
        foreach ($words as $w) {
            $initials .= isset($w[0]) ? $w[0] : '';
        }
        return strtoupper(substr($initials, 0, 2));
    }
}
