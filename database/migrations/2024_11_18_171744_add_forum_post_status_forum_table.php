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
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->string('status')->default('Visible');

        });

        Schema::table('departments', function (Blueprint $table) {
            // Check if the column already exists before adding it
            if (!Schema::hasColumn('departments', 'dept_acronym')) {
                $table->string('dept_acronym');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->dropColumn('status');

        });
        
        Schema::table('departments', function (Blueprint $table) {
            // Drop the column if it exists
            if (Schema::hasColumn('departments', 'dept_acronym')) {
                $table->dropColumn('dept_acronym');
            }});
    }
};

