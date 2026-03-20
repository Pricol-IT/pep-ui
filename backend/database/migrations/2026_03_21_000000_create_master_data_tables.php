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
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('plants', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('name');
            $table->timestamps();
        });
        
        // Also update companies and locations to have external_id for syncing
        Schema::table('companies', function (Blueprint $table) {
            if (!Schema::hasColumn('companies', 'external_id')) {
                $table->string('external_id')->nullable()->unique()->after('id');
            }
        });

        Schema::table('locations', function (Blueprint $table) {
            if (!Schema::hasColumn('locations', 'external_id')) {
                $table->string('external_id')->nullable()->unique()->after('id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
        Schema::dropIfExists('divisions');
        Schema::dropIfExists('plants');
        Schema::dropIfExists('branches');
        
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('external_id');
        });
    }
};
