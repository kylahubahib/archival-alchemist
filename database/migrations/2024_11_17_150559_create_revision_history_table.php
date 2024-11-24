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
    
        Schema::create('revision_history', function (Blueprint $table) {
            $table->id();
            $table->string('ins_comment')->nullable();
            $table->foreignId('man_doc_id')->constrained('id')->on('manuscripts')->onDelete('cascade');
            $table->string('man_doc_status', 1)->default('S');
            $table->foreignId('ins_id')->constrained('id')->on('users')->onDelete('cascade');
            $table->foreignId('group_id')->constrained('id')->on('groups')->onDelete('cascade');
            $table->foreignId('section_id')->constrained('id')->on('sections')->onDelete('cascade');
            $table->timestamp('uploaded_at')->nullable(); // Add uploaded_at column
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revision_history');
    }
};
