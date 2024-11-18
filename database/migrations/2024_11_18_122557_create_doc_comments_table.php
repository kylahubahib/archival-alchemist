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
            $table->text('doc_comment'); // Comment content
            $table->timestamp('edited_at')->nullable(); // Date edited
            $table->bigInteger('user_id'); // User Id
            $table->bigInteger('man_doc_id'); // Capstone document Id
            $table->timestamps(); // Includes created_at (Date created) and updated_at
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
