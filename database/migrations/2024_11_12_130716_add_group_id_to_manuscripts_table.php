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
        // Add the `group_id` column only if it doesn't already exist
        Schema::table('manuscripts', function (Blueprint $table) {
            if (!Schema::hasColumn('manuscripts', 'group_id')) {
                $table->unsignedBigInteger('group_id')->nullable(); // Allow NULL
                $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the `group_id` column and foreign key
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropForeign(['group_id']);  // Drop the foreign key first
            $table->dropColumn('group_id');     // Then drop the column
        });
    }
};
