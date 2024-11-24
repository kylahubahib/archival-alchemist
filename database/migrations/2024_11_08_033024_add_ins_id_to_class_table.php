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
        Schema::table('class', function (Blueprint $table) {
            // Check if the foreign key exists before attempting to drop it
            if (Schema::hasColumn('class', 'stud_id')) {
                $table->dropForeign(['stud_id']); // Drop the foreign key constraint
            }

            // Check if the 'stud_id' column exists before dropping it
            if (Schema::hasColumn('class', 'stud_id')) {
                $table->dropColumn('stud_id');    // Drop the column
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('class', function (Blueprint $table) {
            // Add the 'stud_id' column back if needed
            $table->foreignId('stud_id')->nullable()->constrained('users')->onDelete('cascade');
        });
    }
};
