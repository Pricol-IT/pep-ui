<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageAccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::first();
        if ($user) {
            $pages = [
                'dashboard',
                'attendance',
                'leave',
                'payroll',
                'performance',
                'travel',
                'knowledge',
                'directory',
                'about',
                'content',
                'profile',
                'birthdays'
            ];

            foreach ($pages as $page) {
                \App\Models\PageAccess::updateOrCreate([
                    'user_id' => $user->id,
                    'page_name' => $page,
                ], [
                    'can_access' => true
                ]);
            }
        }
    }
}
