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
        Schema::table('branches', function (Blueprint $table) {
            if (!Schema::hasColumn('branches', 'company_id')) {
                $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');
            }
        });

        Schema::table('locations', function (Blueprint $table) {
            if (!Schema::hasColumn('locations', 'plant_id')) {
                $table->foreignId('plant_id')->nullable()->constrained('plants')->onDelete('cascade');
            }
        });

        Schema::table('divisions', function (Blueprint $table) {
            if (!Schema::hasColumn('divisions', 'location_id')) {
                $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn('company_id');
        });
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('plant_id');
        });
        Schema::table('divisions', function (Blueprint $table) {
            $table->dropColumn('location_id');
        });
    }
};
