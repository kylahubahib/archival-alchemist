<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();

            // Foreign key to the users table (the user who bookmarked the manuscript)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Foreign key to the manuscripts table (the manuscript being bookmarked)
            $table->foreignId('man_doc_id')->constrained()->onDelete('cascade');

            // Add timestamps to track when the manuscript was favorited
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
