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
        // Check if 'course_id' column does not exist before adding it
        // if (!Schema::hasColumn('faculties', 'course_id')) {
        //     Schema::table('faculties', function (Blueprint $table) {
        //         $table->unsignedBigInteger('course_id')->nullable()->after('uni_branch_id');
        //         $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        //     });
        // }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the 'course_id' column if it exists
        // if (Schema::hasColumn('faculties', 'course_id')) {
        //     Schema::table('faculties', function (Blueprint $table) {
        //         $table->dropForeign(['course_id']);
        //         $table->dropColumn('course_id');
        //     });
        // }
    }
};
