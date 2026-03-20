<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Http\Kernel::class)->bootstrap();

try {
    $tables = Illuminate\Support\Facades\DB::connection('common_db')
        ->select("SELECT name FROM sys.tables");
    print_r($tables);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
