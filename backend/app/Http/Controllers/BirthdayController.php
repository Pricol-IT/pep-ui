<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class BirthdayController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        try {
            // Using DB::raw for SQL Server date functions
            $employees = DB::connection('common_db')
                ->table('GroupEmployeeInfo')
                ->select([
                    'emp_code', 
                    'emp_name', 
                    'dob', 
                    'designation_name', 
                    'department_name', 
                    'company_name', 
                    'official_mail_id',
                    'status'
                ])
                ->where('status', 'A')
                ->where('employee_type_name', 'WHITE COLLAR')
                ->where(function ($query) use ($today, $tomorrow) {
                    $query->whereRaw("MONTH(dob) = ? AND DAY(dob) = ?", [$today->month, $today->day])
                          ->orWhereRaw("MONTH(dob) = ? AND DAY(dob) = ?", [$tomorrow->month, $tomorrow->day]);
                })
                ->get();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch birthdays', 'message' => $e->getMessage()], 500);
        }

        $userDepartment = Auth::check() ? Auth::user()->department : null;

        $response = [
            'today' => [],
            'tomorrow' => [],
            'team_today' => [],
            'team_tomorrow' => [],
        ];

        foreach ($employees as $emp) {
            $dob = Carbon::parse($emp->dob);
            
            // Check if birthday is today or tomorrow ignoring year
            $isToday = $dob->month === $today->month && $dob->day === $today->day;
            $isTomorrow = $dob->month === $tomorrow->month && $dob->day === $tomorrow->day;
            
            $data = [
                'name' => $emp->emp_name,
                'designation' => $emp->designation_name,
                'department' => $emp->department_name,
                'company' => $emp->company_name,
                'dob_date' => $dob->format('Y-m-d'),
                'display_date' => $dob->format('d M'),
                'email' => $emp->official_mail_id,
                'initials' => $this->getInitials($emp->emp_name),
            ];

            if ($isToday) {
                $response['today'][] = $data;
                // Check if user is in the same department (simple team logic)
                if ($userDepartment && strcasecmp(trim($emp->department_name), trim($userDepartment)) === 0) {
                     $response['team_today'][] = $data;
                }
            }
            
            if ($isTomorrow) {
                $response['tomorrow'][] = $data;
                if ($userDepartment && strcasecmp(trim($emp->department_name), trim($userDepartment)) === 0) {
                     $response['team_tomorrow'][] = $data;
                }
            }
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
