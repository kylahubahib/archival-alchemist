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
        Schema::table('courses', function (Blueprint $table) {
            // Check if the column already exists before adding it
            if (!Schema::hasColumn('courses', 'course_acronym')) {
                $table->string('course_acronym');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Drop the column if it exists
            if (Schema::hasColumn('courses', 'course_acronym')) {
                $table->dropColumn('course_acronym');
            }
        });
    }
};

