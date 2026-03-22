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
use Illuminate\Support\Facades\Cache;
use App\Models\OrganizationStructure;

class CompanyLocationController extends Controller
{
    private $progressKey = 'admin_sync_progress';

    public function getSyncStatus()
    {
        return response()->json(Cache::get($this->progressKey, [
            'status' => 'idle',
            'percentage' => 0,
            'logs' => [],
            'last_updated' => null
        ]));
    }

    public function getOrganization()
    {
        $structures = OrganizationStructure::with([
            'company', 'location', 'branch', 'plant', 'division', 'department'
        ])->get();

        $companies = [];

        foreach ($structures as $s) {
            $compId = $s->company_id;
            if (!isset($companies[$compId])) {
                $companies[$compId] = $s->company->toArray();
                $companies[$compId]['branches'] = [];
            }

            // Level 2: Branch
            $brId = $s->branch_id;
            if (!isset($companies[$compId]['branches'][$brId])) {
                $companies[$compId]['branches'][$brId] = $s->branch->toArray();
                $companies[$compId]['branches'][$brId]['plants'] = [];
            }
            $currParent = &$companies[$compId]['branches'][$brId];

            // Level 3: Plant
            $plId = $s->plant_id;
            if (!isset($currParent['plants'][$plId])) {
                $currParent['plants'][$plId] = $s->plant->toArray();
                $currParent['plants'][$plId]['locations'] = [];
            }
            $currParent = &$currParent['plants'][$plId];

            // Level 4: Location
            $locId = $s->location_id;
            if (!isset($currParent['locations'][$locId])) {
                $currParent['locations'][$locId] = $s->location->toArray();
                $currParent['locations'][$locId]['divisions'] = [];
            }
            $currParent = &$currParent['locations'][$locId];

            // Level 5: Division
            $divId = $s->division_id;
            if (!isset($currParent['divisions'][$divId])) {
                $currParent['divisions'][$divId] = $s->division->toArray();
                $currParent['divisions'][$divId]['departments'] = [];
            }
            $currParent = &$currParent['divisions'][$divId];

            // Level 6: Department
            $deptId = $s->department_id;
            if (!isset($currParent['departments'][$deptId])) {
                $currParent['departments'][$deptId] = $s->department->toArray();
            }
        }

        // Convert associative arrays back to indexed for JSON
        $result = array_values(array_map(function($c) {
            $c['branches'] = array_values(array_map(function($b) {
                $b['plants'] = array_values(array_map(function($p) {
                    $p['locations'] = array_values(array_map(function($l) {
                        $l['divisions'] = array_values(array_map(function($div) {
                            $div['departments'] = array_values($div['departments']);
                            return $div;
                        }, $l['divisions']));
                        return $l;
                    }, $p['locations']));
                    return $p;
                }, $b['plants']));
                return $b;
            }, $c['branches']));
            return $c;
        }, $companies));

        return response()->json($result);
    }

    private function updateProgress($status, $percentage, $logMessage = null)
    {
        $current = Cache::get($this->progressKey, [
            'status' => 'idle',
            'percentage' => 0,
            'logs' => [],
            'last_updated' => null
        ]);

        $current['status'] = $status;
        $current['percentage'] = $percentage;
        $current['last_updated'] = now()->format('Y-m-d H:i:s');
        
        if ($logMessage) {
            $current['logs'][] = [
                'time' => now()->format('H:i:s'),
                'message' => $logMessage
            ];
            // Keep only last 50 logs to save cache space
            if (count($current['logs']) > 50) {
                array_shift($current['logs']);
            }
        }

        try {
            Cache::put($this->progressKey, $current, 600); // 10 minutes
        } catch (\Exception $e) {
            \Log::error('Cache update failed: ' . $e->getMessage());
        }
    }
    // --- Master Data ---

    public function getCompanies()
    {
        return Company::with('creator')->orderBy('name')->get();
    }

    public function getBranches()
    {
        return Branch::with(['company'])->orderBy('name')->get();
    }

    public function getPlants()
    {
        return Plant::with(['branch'])->orderBy('name')->get();
    }

    public function getLocations()
    {
        return Location::with(['plant'])->orderBy('name')->get();
    }

    public function getDivisions()
    {
        return Division::with(['location'])->orderBy('name')->get();
    }

    public function getDepartments()
    {
        return Department::with(['division'])->orderBy('name')->get();
    }

    public function syncFromCommonDb()
    {
        set_time_limit(300); // 5 minutes 
        
        $this->updateProgress('running', 5, 'Starting synchronization from master database...');

        try {
            // Clear mapping table for fresh sync
            OrganizationStructure::truncate();

            // 1. Group unique master records and unique paths
            $rawCompanies = [];
            $rawLocations = [];
            $rawBranches = [];
            $rawPlants = [];
            $rawDivisions = [];
            $rawDepartments = [];
            $rawPaths = [];

            DB::connection('common_db')->table('GroupEmployeeInfo')
                ->select([
                    'company_id', 'company_name',
                    'branch_id', 'branch_name',
                    'plant_id', 'plant_name',
                    'location_id', 'location_name',
                    'division_id', 'division_name',
                    'department_id', 'department_name'
                ])
                ->where('status', 'A')
                ->orderBy('company_id')
                ->chunk(2000, function ($rows) use (&$rawCompanies, &$rawBranches, &$rawPlants, &$rawLocations, &$rawDivisions, &$rawDepartments, &$rawPaths) {
                    $this->updateProgress('running', 10, 'Fetching batch of employee records...');
                    foreach ($rows as $row) {
                        $coName = trim($row->company_name ?: 'N/A');
                        $brName = trim($row->branch_name ?: 'N/A');
                        $plName = trim($row->plant_name ?: 'N/A');
                        $lcName = trim($row->location_name ?: 'N/A');
                        $dvName = trim($row->division_name ?: 'N/A');
                        $dpName = trim($row->department_name ?: 'N/A');

                        // 1. Collect Companies
                        if (!isset($rawCompanies[$coName])) {
                            $rawCompanies[$coName] = true;
                        }

                        // 2. Collect Branches (per Company)
                        $brKey = $coName . '|' . $brName;
                        if (!isset($rawBranches[$brKey])) {
                            $rawBranches[$brKey] = [
                                'name' => $brName,
                                'company_name' => $coName
                            ];
                        }

                        // 3. Collect Plants (per Branch)
                        $plKey = $brKey . '|' . $plName;
                        if (!isset($rawPlants[$plKey])) {
                            $rawPlants[$plKey] = [
                                'name' => $plName,
                                'branch_key' => $brKey
                            ];
                        }

                        // 4. Collect Locations (per Plant)
                        $lcKey = $plKey . '|' . $lcName;
                        if (!isset($rawLocations[$lcKey])) {
                            $rawLocations[$lcKey] = [
                                'name' => $lcName,
                                'plant_key' => $plKey,
                                'company_name' => $coName
                            ];
                        }

                        // 5. Collect Divisions (per Location)
                        $dvKey = $lcKey . '|' . $dvName;
                        if (!isset($rawDivisions[$dvKey])) {
                            $rawDivisions[$dvKey] = [
                                'name' => $dvName,
                                'location_key' => $lcKey
                            ];
                        }

                        // 6. Collect Departments (per Division)
                        $dpKey = $dvKey . '|' . $dpName;
                        if (!isset($rawDepartments[$dpKey])) {
                            $rawDepartments[$dpKey] = [
                                'name' => $dpName,
                                'division_key' => $dvKey
                            ];
                        }

                        // 7. Store Path for Mapping Table
                        $rawPaths[$dpKey] = [
                            'company' => $coName,
                            'branch_key' => $brKey,
                            'plant_key' => $plKey,
                            'location_key' => $lcKey,
                            'division_key' => $dvKey,
                            'department_key' => $dpKey
                        ];
                    }
                });
            
            $this->updateProgress('running', 20, 'Master data collected. Starting hierarchy synchronization...');

            $syncInfo = [
                'companies' => 0,
                'branches' => 0,
                'plants' => 0,
                'locations' => 0,
                'divisions' => 0,
                'departments' => 0,
            ];

            // 2. Helper: Ensure "N/A" records exist (for individual lookups)
            $placeholderIds = [];
            $placeholderIds['company'] = Company::firstOrCreate(['name' => 'N/A'], ['short_name' => 'NA'])->id;
            
            // Branch child of Company
            $placeholderIds['branch'] = Branch::firstOrCreate(['name' => 'N/A', 'company_id' => $placeholderIds['company']])->id;
            
            // Plant child of Branch
            $placeholderIds['plant'] = Plant::firstOrCreate(['name' => 'N/A', 'branch_id' => $placeholderIds['branch']])->id;
            
            // Location child of Plant (also requires company_id in DB)
            $placeholderIds['location'] = Location::firstOrCreate(
                ['name' => 'N/A', 'plant_id' => $placeholderIds['plant']], 
                ['company_id' => $placeholderIds['company']]
            )->id;
            
            // Division child of Location
            $placeholderIds['division'] = Division::firstOrCreate(['name' => 'N/A', 'location_id' => $placeholderIds['location']])->id;
            
            // Department child of Division
            $placeholderIds['department'] = Department::firstOrCreate(['name' => 'N/A', 'division_id' => $placeholderIds['division']])->id;

            // 3. Sync Companies
            $localCoIds = [];
            foreach ($rawCompanies as $compName => $ignore) {
                if (!$compName) continue;
                $shortName = '-';
                if (strpos($compName, ' - ') !== false) {
                    $parts = explode(' - ', $compName);
                    $shortName = trim(end($parts));
                }

                $company = Company::updateOrCreate(
                    ['name' => $compName],
                    ['short_name' => $shortName]
                );
                $localCoIds[$compName] = $company->id;
                $syncInfo['companies']++;
            }
            $this->updateProgress('running', 30, 'Synced ' . $syncInfo['companies'] . ' companies.');

            // 4. Sync Branches
            $localBrIds = [];
            foreach ($rawBranches as $key => $data) {
                $parentId = $localCoIds[$data['company_name']] ?? $placeholderIds['company'];

                $branch = Branch::updateOrCreate(
                    ['name' => $data['name'], 'company_id' => $parentId]
                );
                $localBrIds[$key] = $branch->id;
                $syncInfo['branches']++;
            }
            $this->updateProgress('running', 45, 'Synced ' . $syncInfo['branches'] . ' branches.');

            // 5. Sync Plants
            $localPlIds = [];
            foreach ($rawPlants as $key => $data) {
                $parentId = $localBrIds[$data['branch_key']] ?? $placeholderIds['branch'];

                $plant = Plant::updateOrCreate(
                    ['name' => $data['name'], 'branch_id' => $parentId]
                );
                $localPlIds[$key] = $plant->id;
                $syncInfo['plants']++;
            }
            $this->updateProgress('running', 60, 'Synced ' . $syncInfo['plants'] . ' plants.');

            // 6. Sync Locations
            $localLcIds = [];
            foreach ($rawLocations as $key => $data) {
                $parentId = $localPlIds[$data['plant_key']] ?? $placeholderIds['plant'];
                $coId = $localCoIds[$data['company_name']] ?? $placeholderIds['company'];

                $location = Location::updateOrCreate(
                    ['name' => $data['name'], 'plant_id' => $parentId],
                    ['company_id' => $coId]
                );
                $localLcIds[$key] = $location->id;
                $syncInfo['locations']++;
            }
            $this->updateProgress('running', 75, 'Synced ' . $syncInfo['locations'] . ' locations.');

            // 7. Sync Divisions
            $localDvIds = [];
            foreach ($rawDivisions as $key => $data) {
                $parentId = $localLcIds[$data['location_key']] ?? $placeholderIds['location'];

                $division = Division::updateOrCreate(
                    ['name' => $data['name'], 'location_id' => $parentId]
                );
                $localDvIds[$key] = $division->id;
                $syncInfo['divisions']++;
            }
            $this->updateProgress('running', 85, 'Synced ' . $syncInfo['divisions'] . ' divisions.');

            // 8. Sync Departments
            $localDpIds = [];
            foreach ($rawDepartments as $key => $data) {
                $parentId = $localDvIds[$data['division_key']] ?? $placeholderIds['division'];

                $department = Department::updateOrCreate(
                    ['name' => $data['name'], 'division_id' => $parentId]
                );
                $localDpIds[$key] = $department->id;
                $syncInfo['departments']++;
            }
            $this->updateProgress('running', 95, 'Synced ' . $syncInfo['departments'] . ' departments.');

            // 9. Sync Organization Structures (Mapping Table)
            $this->updateProgress('running', 98, 'Mapping organizational structures...');
            foreach ($rawPaths as $path) {
                $co = $localCoIds[$path['company']] ?? $placeholderIds['company'];
                $br = $localBrIds[$path['branch_key']] ?? $placeholderIds['branch'];
                $pl = $localPlIds[$path['plant_key']] ?? $placeholderIds['plant'];
                $lc = $localLcIds[$path['location_key']] ?? $placeholderIds['location'];
                $dv = $localDvIds[$path['division_key']] ?? $placeholderIds['division'];
                $dp = $localDpIds[$path['department_key']] ?? $placeholderIds['department'];

                OrganizationStructure::updateOrCreate([
                    'company_id' => $co,
                    'branch_id' => $br,
                    'plant_id' => $pl,
                    'location_id' => $lc,
                    'division_id' => $dv,
                    'department_id' => $dp
                ]);
            }
            
            $this->updateProgress('completed', 100, 'Hierarchy sync completed successfully.');

            return response()->json(['message' => 'Hierarchy Sync completed successfully', 'info' => $syncInfo]);
        } catch (\Exception $e) {
            $this->updateProgress('failed', 0, 'Sync failed: ' . $e->getMessage());
            return response()->json(['message' => 'Sync failed: ' . $e->getMessage()], 500);
        }
    }
}
