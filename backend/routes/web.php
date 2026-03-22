<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\TimetrackController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/redirect', [AuthController::class, 'redirectToAzure'])->name('login');
Route::get('/auth/callback', [AuthController::class, 'handleAzureCallback'])->name('auth.callback');
Route::get('/auth/user', [AuthController::class, 'user'])->middleware('auth');
Route::match(['get', 'post'], '/auth/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::get('/calendar/events', [CalendarController::class, 'index']);
    Route::prefix('api')->group(function () {
        Route::get('/birthdays', [App\Http\Controllers\BirthdayController::class, 'index']);
        Route::get('/new-joiners', [App\Http\Controllers\NewJoinerController::class, 'index']);
    });
    // Since we are using standard web middleware with CSRF protection, 
    // but the frontend might be sending DELETE, we'll keep it simple.
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    
    // Timetrack Redirect (Using /auth prefix so production Nginx proxies it to Laravel)
    Route::get('/auth/timetrack', [TimetrackController::class, 'redirect']);
    
    // Admin / Access Request Routes
    Route::get('/api/admin/access-request/status', [App\Http\Controllers\AdminController::class, 'checkStatus']);
    Route::post('/api/admin/access-request', [App\Http\Controllers\AdminController::class, 'store']);
    
    // Protected Admin Routes (Authorization handled in Controller or Middleware)
    Route::get('/api/admin/requests', [App\Http\Controllers\AdminController::class, 'index']);
    Route::post('/api/admin/requests/{id}/approve', [App\Http\Controllers\AdminController::class, 'approve']);
    Route::post('/api/admin/requests/{id}/reject', [App\Http\Controllers\AdminController::class, 'reject']);

    // Companies & Locations (Automated Sync)
    Route::get('/api/admin/companies', [App\Http\Controllers\CompanyLocationController::class, 'getCompanies']);
    Route::get('/api/admin/locations', [App\Http\Controllers\CompanyLocationController::class, 'getLocations']);
    Route::get('/api/admin/branches', [App\Http\Controllers\CompanyLocationController::class, 'getBranches']);
    Route::get('/api/admin/plants', [App\Http\Controllers\CompanyLocationController::class, 'getPlants']);
    Route::get('/api/admin/divisions', [App\Http\Controllers\CompanyLocationController::class, 'getDivisions']);
    Route::get('/api/admin/departments', [App\Http\Controllers\CompanyLocationController::class, 'getDepartments']);
    Route::post('/api/admin/sync', [App\Http\Controllers\CompanyLocationController::class, 'syncFromCommonDb']);
    Route::get('/api/admin/sync-status', [App\Http\Controllers\CompanyLocationController::class, 'getSyncStatus']);
    Route::get('/api/admin/organization', [App\Http\Controllers\CompanyLocationController::class, 'getOrganization']);
    
    // Office Details
    Route::get('/api/admin/office-details', [App\Http\Controllers\OfficeDetailController::class, 'index']);
    Route::get('/api/admin/office-details/{locationId}', [App\Http\Controllers\OfficeDetailController::class, 'show']);
    Route::post('/api/admin/office-details', [App\Http\Controllers\OfficeDetailController::class, 'store']);
    Route::delete('/api/admin/office-details/{id}', [App\Http\Controllers\OfficeDetailController::class, 'destroy']);
    Route::get('/api/weather', [App\Http\Controllers\OfficeDetailController::class, 'getWeather']);
    
    // Analytics
    Route::get('/api/admin/analytics/logins', [App\Http\Controllers\AnalyticsController::class, 'getLogins']);
    Route::get('/api/admin/analytics/clicks', [App\Http\Controllers\AnalyticsController::class, 'getClicks']);
    Route::get('/api/admin/analytics/tasks', [App\Http\Controllers\AnalyticsController::class, 'getTasks']);
    Route::post('/api/track-click', [App\Http\Controllers\LinkClickController::class, 'store']);

    // Announcements
    Route::get('/announcements/active', [App\Http\Controllers\AnnouncementController::class, 'getActive']);
    Route::get('/api/admin/announcements', [App\Http\Controllers\AnnouncementController::class, 'index']);
    Route::post('/api/admin/announcements', [App\Http\Controllers\AnnouncementController::class, 'store']);
    Route::put('/api/admin/announcements/{announcement}', [App\Http\Controllers\AnnouncementController::class, 'update']);
    Route::patch('/api/admin/announcements/{announcement}/toggle', [App\Http\Controllers\AnnouncementController::class, 'toggle']);
    Route::delete('/api/admin/announcements/{announcement}', [App\Http\Controllers\AnnouncementController::class, 'destroy']);
});

// Catch-all route for SPA mapping
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
