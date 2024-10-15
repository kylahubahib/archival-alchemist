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
        Schema::table('revision_history', function (Blueprint $table) {
            $table->dropForeign(['stud_id']);
            $table->dropColumn('stud_id'); // Remove the stud_id column
            $table->timestamp('uploaded_at')->nullable(); // Add uploaded_at column
            $table->string('status')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('revision_history', function (Blueprint $table) {
            //$table->foreignId('stud_id')->constrained('users')->onDelete('cascade'); // Restore stud_id
            $table->dropColumn('uploaded_at'); // Remove uploaded_at column
            $table->dropColumn('status');
        });
    }
};
