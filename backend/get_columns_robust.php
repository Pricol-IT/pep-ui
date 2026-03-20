<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Http\Kernel::class)->bootstrap();

try {
    $row = Illuminate\Support\Facades\DB::connection('common_db')
        ->table('GroupEmployeeInfo')
        ->first();
    
    if ($row) {
        echo json_encode($row, JSON_PRETTY_PRINT);
    } else {
        echo "No data found in GroupEmployeeInfo";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
