<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;

trait HasTimetrackCookies
{
    /**
     * Generate and set Timetrack cookies for the given user.
     *
     * @param \App\Models\User $user
     * @return void
     */
    protected function setTimetrackCookies($user)
    {
        try {
            // Find employee info from common_db
            $employee = DB::connection('common_db')
                ->table('GroupEmployeeInfo')
                ->where('official_mail_id', $user->email)
                ->first();

            if (!$employee) {
                Log::warning("Employee information not found for user: {$user->email} in common_db.");
                return;
            }

            // Extract prefix from company_name, e.g., "PRICOL HOLDINGS LIMITED ( PCS )" -> "PCS"
            $prefix = '';
            if (preg_match('/\(([^)]+)\)/', $employee->company_name, $matches)) {
                $prefix = trim($matches[1]);
            }

            // Prepare values
            $cid = $employee->company_id;
            $eid = $employee->emp_code;
            $paddedEid = str_pad($eid, 4, '0', STR_PAD_LEFT);
            $loginUserName = $prefix . $paddedEid;
            $empName = $employee->emp_name;
            $approverCompany = $employee->approver_company_id;
            $approverEmpCode = $employee->approver_emp_code;
            $approverEmail = $employee->approver_mail_id;
            $companyName = $employee->company_name;
            $userMail = $employee->official_mail_id;

            // Construct pep_cook value exactly as requested
            // Note: UserCompanyName has %0d%0a (CRLF) in the example
            $pepCookValue = "HRUser=NA" .
                            "&cmpid={$cid}" .
                            "&empcode={$eid}" .
                            "&LoginUserName={$loginUserName}" .
                            "&UserType=U" .
                            "&UserApproverCompany={$approverCompany}" .
                            "&UserApproverEmpCode={$approverEmpCode}" .
                            "&EmployeeName=" . urlencode($empName) .
                            "&NEmpCode={$eid}" .
                            "&CompanyId={$cid}" .
                            "&ApproverMailid={$approverEmail}" .
                            "&UserCompanyName=" . urlencode($companyName) . "%0d%0a" .
                            "&UserMailid={$userMail}";

            // Determine cookie domain: User strictly requested .mypricol.in
            // Note: This cookie will NOT be visible if you access the site via 'localhost'.
            // You must use a domain like 'pep.mypricol.in' to see this cookie.
            $domain = '.mypricol.in';

            // Create cookies (Session duration: Use 0 or don't specify for session cookies in some contexts, but Laravel Cookie::make uses minutes)
            // Session cookie in Laravel is usually achieved by not providing an expiration or using 0, but Cookie::make requires minutes.
            // Using 0 in Laravel Cookie::make / Cookie::queue results in a session cookie.
            
            $pepCookie = Cookie::make('pep_cook', $pepCookValue, 0, '/', $domain, false, false, true);
            $cvUidValue = str_pad($employee->alternate_code ?: $eid, 7, '0', STR_PAD_LEFT);
            $cvUidCookie = Cookie::make('cv_uid', $cvUidValue, 0, '/', $domain, false, false, true);

            Cookie::queue($pepCookie);
            Cookie::queue($cvUidCookie);

            Log::info("Timetrack cookies set for user: {$user->email}");

        } catch (\Exception $e) {
            Log::error("Failed to set Timetrack cookies for user {$user->email}: " . $e->getMessage());
        }
    }
}
