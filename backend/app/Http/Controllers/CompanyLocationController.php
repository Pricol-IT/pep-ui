<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyLocationController extends Controller
{
    // --- Companies ---

    public function getCompanies()
    {
        return Company::with('creator')->orderBy('created_at', 'desc')->get();
    }

    public function storeCompany(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:companies,name',
            'short_name' => 'required|string|unique:companies,short_name',
        ]);

        $company = Company::create([
            'name' => $request->name,
            'short_name' => $request->short_name,
            'created_by' => Auth::id(),
        ]);

        return response()->json($company, 201);
    }

    // --- Locations ---

    public function getLocations()
    {
        return Location::with(['company', 'creator'])->orderBy('created_at', 'desc')->get();
    }

    public function storeLocation(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'company_id' => 'required|exists:companies,id',
        ]);

        $location = Location::create([
            'name' => $request->name,
            'company_id' => $request->company_id,
            'created_by' => Auth::id(),
        ]);

        return response()->json($location->load('company'), 201);
    }

    public function deleteCompany($id)
    {
        $company = Company::findOrFail($id);
        
        if ($company->locations()->count() > 0) {
            return response()->json(['message' => 'Cannot delete company with existing locations.'], 400);
        }

        $company->delete();
        return response()->json(['message' => 'Company deleted successfully']);
    }

    public function deleteLocation($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return response()->json(['message' => 'Location deleted successfully']);
    }
}
