<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

try {
    $row = Illuminate\Support\Facades\DB::connection('common_db')
        ->table('GroupEmployeeInfo')
        ->first();
    print_r($row);
} catch (Exception $e) {
    echo $e->getMessage();
}
