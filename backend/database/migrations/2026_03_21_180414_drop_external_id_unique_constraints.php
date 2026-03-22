<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropUnique(['external_id']);
        });
        Schema::table('plants', function (Blueprint $table) {
            $table->dropUnique(['external_id']);
        });
        Schema::table('locations', function (Blueprint $table) {
            $table->dropUnique(['external_id']);
        });
        Schema::table('divisions', function (Blueprint $table) {
            $table->dropUnique(['external_id']);
        });
        Schema::table('departments', function (Blueprint $table) {
            $table->dropUnique(['external_id']);
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->unique('external_id');
        });
        Schema::table('plants', function (Blueprint $table) {
            $table->unique('external_id');
        });
        Schema::table('locations', function (Blueprint $table) {
            $table->unique('external_id');
        });
        Schema::table('divisions', function (Blueprint $table) {
            $table->unique('external_id');
        });
        Schema::table('departments', function (Blueprint $table) {
            $table->unique('external_id');
        });
    }
};
