<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the Superadmin exists or update role if exists
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'Rubesh.ramesh@pricol.com'],
            [
                'name' => 'Rubesh Ramesh',
                'password' => bcrypt('password'), // Temporary password, will be handled by SSO mainly
                'role' => 'superadmin',
            ]
        );

        if ($user->role !== 'superadmin') {
            $user->role = 'superadmin';
            $user->save();
        }
    }
}
