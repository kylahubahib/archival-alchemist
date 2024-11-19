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
        Schema::create('doc_comments', function (Blueprint $table) {
            $table->id();
            $table->timestamp('edited_at')->nullable(); // Date edited
            $table->text('body')->nullable();;
            $table->text('content');
            $table->unsignedBigInteger('parent_id')->nullable(); // Parent comment ID for replies

            // $table->morphs('commentable');
            $table->string('commentable_type')->nullable(); // Adjust as per your needs

            $table->softDeletes();
            $table->timestamps(); // Includes created_at (Date created) and updated_at

            $table->foreignId('man_doc_id')->constrained('id')->on('manuscripts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doc_comments');
    }
};
