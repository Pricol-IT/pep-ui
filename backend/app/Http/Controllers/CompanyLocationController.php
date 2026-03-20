<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Location;
use App\Models\Branch;
use App\Models\Plant;
use App\Models\Division;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompanyLocationController extends Controller
{
    // --- Master Data ---

    public function getCompanies()
    {
        return Company::with('creator')->orderBy('name')->get();
    }

    public function getLocations()
    {
        return Location::with(['company', 'creator'])->orderBy('name')->get();
    }

    public function getBranches()
    {
        return Branch::orderBy('name')->get();
    }

    public function getPlants()
    {
        return Plant::orderBy('name')->get();
    }

    public function getDivisions()
    {
        return Division::orderBy('name')->get();
    }

    public function getDepartments()
    {
        return Department::orderBy('name')->get();
    }

    public function syncFromCommonDb()
    {
        try {
            $data = DB::connection('common_db')
                ->table('GroupEmployeeInfo')
                ->select([
                    'company_id', 'company_name',
                    'branch_id', 'branch_name',
                    'plant_id', 'plant_name',
                    'location_id', 'location_name',
                    'division_id', 'division_name',
                    'department_id', 'department_name'
                ])
                ->where('status', 'A')
                ->get();

            $syncInfo = [
                'companies' => 0,
                'branches' => 0,
                'plants' => 0,
                'locations' => 0,
                'divisions' => 0,
                'departments' => 0,
            ];

            foreach ($data as $row) {
                // Sync Company
                if ($row->company_id && $row->company_name) {
                    $companyName = trim($row->company_name);
                    $shortName = strtoupper(substr($companyName, 0, 3));
                    $cleanName = $companyName;

                    if (strpos($companyName, ' - ') !== false) {
                        $parts = explode(' - ', $companyName);
                        $shortName = trim(end($parts));
                        // Optional: remove the short name from the full name if desired
                        // $cleanName = trim(implode(' - ', array_slice($parts, 0, -1)));
                    }

                    // Try to find by external_id first, then by name, then by short_name
                    $company = Company::where('external_id', $row->company_id)
                        ->orWhere('name', $cleanName)
                        ->orWhere('short_name', $shortName)
                        ->first();

                    if ($company) {
                        $company->update([
                            'external_id' => $row->company_id,
                            'name' => $cleanName,
                            'short_name' => $shortName
                        ]);
                    } else {
                        Company::create([
                            'external_id' => $row->company_id,
                            'name' => $cleanName,
                            'short_name' => $shortName
                        ]);
                    }
                    $syncInfo['companies']++;
                }

                // Sync Branch
                if ($row->branch_id && $row->branch_name) {
                    Branch::updateOrCreate(
                        ['external_id' => $row->branch_id],
                        ['name' => $row->branch_name]
                    );
                    $syncInfo['branches']++;
                }

                // Sync Plant
                if ($row->plant_id && $row->plant_name) {
                    Plant::updateOrCreate(
                        ['external_id' => $row->plant_id],
                        ['name' => $row->plant_name]
                    );
                    $syncInfo['plants']++;
                }

                // Sync Location
                if ($row->location_id && $row->location_name) {
                    Location::updateOrCreate(
                        ['external_id' => $row->location_id],
                        ['name' => $row->location_name, 'company_id' => Company::where('external_id', $row->company_id)->first()?->id ?? 1]
                    );
                    $syncInfo['locations']++;
                }

                // Sync Division
                if ($row->division_id && $row->division_name) {
                    Division::updateOrCreate(
                        ['external_id' => $row->division_id],
                        ['name' => $row->division_name]
                    );
                    $syncInfo['divisions']++;
                }

                // Sync Department
                if ($row->department_id && $row->department_name) {
                    Department::updateOrCreate(
                        ['external_id' => $row->department_id],
                        ['name' => $row->department_name]
                    );
                    $syncInfo['departments']++;
                }
            }

            return response()->json(['message' => 'Sync completed successfully', 'info' => $syncInfo]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Sync failed: ' . $e->getMessage()], 500);
        }
    }
}
