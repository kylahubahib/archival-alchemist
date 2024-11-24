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
<<<<<<<< HEAD:database/migrations/2024_11_18_171744_add_forum_post_status_forum_table.php
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->string('status')->default('Visible');
========
        Schema::table('departments', function (Blueprint $table) {
            // Check if the column already exists before adding it
            if (!Schema::hasColumn('departments', 'dept_acronym')) {
                $table->string('dept_acronym');
            }
>>>>>>>> b3f4fb2c45e66bbe609ed4f522e87dc65646d212:database/migrations/2024_11_12_141939_add_dept_acronym_to_departments_table.php
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
<<<<<<<< HEAD:database/migrations/2024_11_18_171744_add_forum_post_status_forum_table.php
        Schema::table('forum_posts', function (Blueprint $table) {
            $table->dropColumn('status');
========
        Schema::table('departments', function (Blueprint $table) {
            // Drop the column if it exists
            if (Schema::hasColumn('departments', 'dept_acronym')) {
                $table->dropColumn('dept_acronym');
            }
>>>>>>>> b3f4fb2c45e66bbe609ed4f522e87dc65646d212:database/migrations/2024_11_12_141939_add_dept_acronym_to_departments_table.php
        });
    }
};

