<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$cookie = cookie('pep_cook', 'HRUser=NA&cmpid=1&empcode=2', 60, '/', '.mypricol.in', false, false, true);
echo $cookie;
