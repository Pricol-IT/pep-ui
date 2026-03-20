<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cookie;

Route::get('/test-cookie', function () {
    $pepCookie = Cookie::make('pep_cook', 'HRUser=NA&cmpid=4&empcode=123', 60, '/', 'localhost', false, false, true);
    return response('OK')->withCookie($pepCookie);
});
