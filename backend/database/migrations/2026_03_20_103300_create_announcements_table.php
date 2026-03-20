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
        Schema::create('announcements', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->text('content');
            $blueprint->string('badge_text')->default('NEW');
            $blueprint->boolean('is_active')->default(false);
            $blueprint->dateTime('start_date')->nullable();
            $blueprint->dateTime('end_date')->nullable();
            $blueprint->foreignId('created_by')->nullable()->constrained('users');
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
