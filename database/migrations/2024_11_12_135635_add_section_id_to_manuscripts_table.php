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
        // Add the `section_id` column only if it doesn't already exist
        Schema::table('manuscripts', function (Blueprint $table) {
            if (!Schema::hasColumn('manuscripts', 'section_id')) {
                $table->foreignId('section_id')->nullable()->constrained('sections')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the foreign key and column
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropForeign(['section_id']);  // Drop the foreign key constraint first
            $table->dropColumn('section_id');     // Then drop the column
        });
    }
};
