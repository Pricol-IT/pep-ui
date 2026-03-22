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
            if (!Schema::hasColumn('branches', 'location_id')) {
                $table->foreignId('location_id')->nullable()->constrained('locations');
            }
        });

        Schema::table('plants', function (Blueprint $table) {
            if (!Schema::hasColumn('plants', 'branch_id')) {
                $table->foreignId('branch_id')->nullable()->constrained('branches');
            }
        });

        Schema::table('divisions', function (Blueprint $table) {
            if (!Schema::hasColumn('divisions', 'plant_id')) {
                $table->foreignId('plant_id')->nullable()->constrained('plants');
            }
        });

        Schema::table('departments', function (Blueprint $table) {
            if (!Schema::hasColumn('departments', 'division_id')) {
                $table->foreignId('division_id')->nullable()->constrained('divisions');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropColumn('division_id');
        });

        Schema::table('divisions', function (Blueprint $table) {
            $table->dropForeign(['plant_id']);
            $table->dropColumn('plant_id');
        });

        Schema::table('plants', function (Blueprint $table) {
            $table->dropForeign(['branch_id']);
            $table->dropColumn('branch_id');
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
        });
    }
};
