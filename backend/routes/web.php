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
    Route::get('/admin/access-request/status', [App\Http\Controllers\AdminController::class, 'checkStatus']);
    Route::post('/admin/access-request', [App\Http\Controllers\AdminController::class, 'store']);
    
    // Protected Admin Routes (Authorization handled in Controller or Middleware)
    Route::get('/admin/requests', [App\Http\Controllers\AdminController::class, 'index']);
    Route::post('/admin/requests/{id}/approve', [App\Http\Controllers\AdminController::class, 'approve']);
    Route::post('/admin/requests/{id}/reject', [App\Http\Controllers\AdminController::class, 'reject']);

    // Companies & Locations (Automated Sync)
    Route::get('/admin/companies', [App\Http\Controllers\CompanyLocationController::class, 'getCompanies']);
    Route::get('/admin/locations', [App\Http\Controllers\CompanyLocationController::class, 'getLocations']);
    Route::get('/admin/branches', [App\Http\Controllers\CompanyLocationController::class, 'getBranches']);
    Route::get('/admin/plants', [App\Http\Controllers\CompanyLocationController::class, 'getPlants']);
    Route::get('/admin/divisions', [App\Http\Controllers\CompanyLocationController::class, 'getDivisions']);
    Route::get('/admin/departments', [App\Http\Controllers\CompanyLocationController::class, 'getDepartments']);
    Route::post('/admin/sync', [App\Http\Controllers\CompanyLocationController::class, 'syncFromCommonDb']);
    Route::get('/admin/sync-status', [App\Http\Controllers\CompanyLocationController::class, 'getSyncStatus']);
    Route::get('/admin/organization', [App\Http\Controllers\CompanyLocationController::class, 'getOrganization']);
    
    // Office Details
    Route::get('/admin/office-details', [App\Http\Controllers\OfficeDetailController::class, 'index']);
    Route::get('/admin/office-details/{locationId}', [App\Http\Controllers\OfficeDetailController::class, 'show']);
    Route::post('/admin/office-details', [App\Http\Controllers\OfficeDetailController::class, 'store']);
    Route::delete('/admin/office-details/{id}', [App\Http\Controllers\OfficeDetailController::class, 'destroy']);
    Route::get('/weather', [App\Http\Controllers\OfficeDetailController::class, 'getWeather']);
    // Announcements
    Route::get('/announcements/active', [App\Http\Controllers\AnnouncementController::class, 'getActive']);
    Route::get('/admin/announcements', [App\Http\Controllers\AnnouncementController::class, 'index']);
    Route::post('/admin/announcements', [App\Http\Controllers\AnnouncementController::class, 'store']);
    Route::put('/admin/announcements/{announcement}', [App\Http\Controllers\AnnouncementController::class, 'update']);
    Route::patch('/admin/announcements/{announcement}/toggle', [App\Http\Controllers\AnnouncementController::class, 'toggle']);
    Route::delete('/admin/announcements/{announcement}', [App\Http\Controllers\AnnouncementController::class, 'destroy']);
});

// Catch-all route for SPA mapping
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
