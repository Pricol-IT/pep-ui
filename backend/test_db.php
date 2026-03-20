<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

try {
    $count = Illuminate\Support\Facades\DB::table('users')->count();
    echo "Users count: " . $count . "\n";
    
    $common_db_test = Illuminate\Support\Facades\DB::connection('common_db')->getPdo();
    echo "Common DB connected\n";
    
    $tables = Illuminate\Support\Facades\DB::connection('common_db')
        ->select("SELECT name FROM sys.tables");
    print_r($tables);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
