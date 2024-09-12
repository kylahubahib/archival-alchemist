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
        Schema::create('author', function (Blueprint $table) {
            // Define the columns
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('man_doc_id');

            // Set the composite primary key
            $table->primary(['user_id', 'man_doc_id']);

            // Define the foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('man_doc_id')->references('id')->on('manuscripts')->onDelete('cascade');

            // Timestamps (optional)
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('author');
    }
};
