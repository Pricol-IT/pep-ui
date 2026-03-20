<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

try {
    $columns = Illuminate\Support\Facades\DB::connection('common_db')
        ->select("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'GroupEmployeeInfo'");
    print_r($columns);
} catch (Exception $e) {
    echo $e->getMessage();
}
