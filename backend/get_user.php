<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

try {
    $user = Illuminate\Support\Facades\DB::table('users')->first();
    if ($user) {
        echo "Email: " . $user->email . "\n";
        $employee = Illuminate\Support\Facades\DB::connection('common_db')
            ->table('GroupEmployeeInfo')
            ->where('official_mail_id', $user->email)
            ->first();
        print_r($employee);
    } else {
        echo "No users found in portal db\n";
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
