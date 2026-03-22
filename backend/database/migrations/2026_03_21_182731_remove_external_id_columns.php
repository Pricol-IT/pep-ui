<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
        Schema::table('plants', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
        Schema::table('divisions', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('external_id')->nullable();
        });
        Schema::table('branches', function (Blueprint $table) {
            $table->string('external_id')->nullable();
        });
        Schema::table('plants', function (Blueprint $table) {
            $table->string('external_id')->nullable();
        });
        Schema::table('locations', function (Blueprint $table) {
            $table->string('external_id')->nullable();
        });
        Schema::table('divisions', function (Blueprint $table) {
            $table->string('external_id')->nullable();
        });
        Schema::table('departments', function (Blueprint $table) {
            $table->string('external_id')->nullable();
        });
    }
};
