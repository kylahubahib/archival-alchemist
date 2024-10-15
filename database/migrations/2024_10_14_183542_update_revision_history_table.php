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
            $table->renameColumn('ins_comment', 'comment'); // Rename ins_comment to comment
            $table->renameColumn('ins_id', 'faculty_id'); // Rename ins_id to faculty_id
            $table->timestamp('uploaded_at')->nullable(); // Add uploaded_at column
            $table->string('status')->nullable();
            $table->string('revision_content')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('revision_history', function (Blueprint $table) {
            $table->foreignId('stud_id')->constrained('id')->on('users')->onDelete('cascade'); // Restore stud_id
            $table->renameColumn('comment', 'ins_comment'); // Rename comment back to ins_comment
            $table->renameColumn('faculty_id', 'ins_id'); // Rename faculty_id back to ins_id
            $table->dropColumn('uploaded_at'); // Remove uploaded_at column
            $table->dropColumn('status');
        });
    }
};
