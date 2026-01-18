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
    // Since we are using standard web middleware with CSRF protection, 
    // but the frontend might be sending DELETE, we'll keep it simple.
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});
