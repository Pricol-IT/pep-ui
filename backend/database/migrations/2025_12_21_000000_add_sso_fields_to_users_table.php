<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('job_title')->nullable();
            $table->string('company_name')->nullable();
            $table->string('department')->nullable();
            $table->string('employee_id')->nullable();
            $table->string('office_location')->nullable();
            $table->string('manager_name')->nullable();
            $table->string('mobile_phone')->nullable();
            $table->text('avatar')->nullable(); // Store base64 or URL
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'job_title',
                'company_name',
                'department',
                'employee_id',
                'office_location',
                'manager_name',
                'mobile_phone'
            ]);
        });
    }
};

