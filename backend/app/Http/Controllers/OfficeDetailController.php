<?php

namespace App\Http\Controllers;

use App\Models\OfficeDetail;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class OfficeDetailController extends Controller
{
    public function index()
    {
        return OfficeDetail::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|exists:office_details,id',
            'office_name' => 'required|string|max:255',
            'image' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if (isset($validated['id'])) {
            $detail = OfficeDetail::find($validated['id']);
            $detail->update($validated);
            return $detail;
        }

        return OfficeDetail::updateOrCreate(
            ['office_name' => $validated['office_name']],
            $validated
        );
    }

    public function destroy($id)
    {
        OfficeDetail::destroy($id);
        return response()->json(['success' => true]);
    }

    public function getWeather(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');

        if (!$lat || !$lon) {
            return response()->json(['error' => 'Latitude and longitude are required'], 400);
        }

        $cacheKey = "weather_{$lat}_{$lon}";
        
        return Cache::remember($cacheKey, 1800, function () use ($lat, $lon) {
            $response = Http::get("https://api.open-meteo.com/v1/forecast", [
                'latitude' => $lat,
                'longitude' => $lon,
                'current_weather' => true,
                'hourly' => 'temperature_2m,weathercode',
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return ['error' => 'Failed to fetch weather data'];
        });
    }
}
