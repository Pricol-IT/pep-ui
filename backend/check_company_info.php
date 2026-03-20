<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Http\Kernel::class)->bootstrap();

try {
    $tables = Illuminate\Support\Facades\DB::connection('common_db')
        ->select("SELECT name FROM sys.tables WHERE name LIKE '%Company%'");
    print_r($tables);
    
    foreach ($tables as $table) {
        echo "\nTable: " . $table->name . "\n";
        $row = Illuminate\Support\Facades\DB::connection('common_db')
            ->table($table->name)
            ->first();
        echo json_encode($row, JSON_PRETTY_PRINT) . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
