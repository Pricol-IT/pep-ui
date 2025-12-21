<?php

use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/redirect', [AuthController::class, 'redirectToAzure'])->name('login');
Route::get('/auth/callback', [AuthController::class, 'handleAzureCallback'])->name('auth.callback');
Route::get('/auth/user', [AuthController::class, 'user'])->middleware('auth');
Route::match(['get', 'post'], '/auth/logout', [AuthController::class, 'logout'])->name('logout');
