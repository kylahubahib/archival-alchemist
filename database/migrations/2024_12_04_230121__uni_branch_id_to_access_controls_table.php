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
        Schema::table('access_controls', function (Blueprint $table) {
            $table->unsignedBigInteger('uni_branch_id')->nullable()->after('user_id');

            // Add foreign key constraint with cascade delete
            $table->foreign('uni_branch_id')
                ->references('id')->on('university_branches')
                ->onDelete('cascade'); // Automatically delete access_control when university branch is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('access_controls', function (Blueprint $table) {
            // Drop foreign key before dropping the column
            $table->dropForeign(['uni_branch_id']);
            $table->dropColumn('uni_branch_id');
        });
    }
};
