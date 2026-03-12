<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CalendarController;

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
    Route::get('/birthdays', [App\Http\Controllers\BirthdayController::class, 'index']);
    Route::get('/new-joiners', [App\Http\Controllers\NewJoinerController::class, 'index']);
    // Since we are using standard web middleware with CSRF protection, 
    // but the frontend might be sending DELETE, we'll keep it simple.
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    
    // Admin / Access Request Routes
    Route::get('/admin/access-request/status', [App\Http\Controllers\AdminController::class, 'checkStatus']);
    Route::post('/admin/access-request', [App\Http\Controllers\AdminController::class, 'store']);
    
    // Protected Admin Routes (Authorization handled in Controller or Middleware)
    Route::get('/admin/requests', [App\Http\Controllers\AdminController::class, 'index']);
    Route::post('/admin/requests/{id}/approve', [App\Http\Controllers\AdminController::class, 'approve']);
    Route::post('/admin/requests/{id}/reject', [App\Http\Controllers\AdminController::class, 'reject']);

    // Companies & Locations
    Route::get('/admin/companies', [App\Http\Controllers\CompanyLocationController::class, 'getCompanies']);
    Route::post('/admin/companies', [App\Http\Controllers\CompanyLocationController::class, 'storeCompany']);
    Route::get('/admin/locations', [App\Http\Controllers\CompanyLocationController::class, 'getLocations']);
    Route::post('/admin/locations', [App\Http\Controllers\CompanyLocationController::class, 'storeLocation']);
    Route::delete('/admin/companies/{id}', [App\Http\Controllers\CompanyLocationController::class, 'deleteCompany']);
    Route::delete('/admin/locations/{id}', [App\Http\Controllers\CompanyLocationController::class, 'deleteLocation']);
});
