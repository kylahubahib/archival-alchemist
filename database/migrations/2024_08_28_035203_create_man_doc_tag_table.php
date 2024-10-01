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
        Schema::create('man_doc_tag', function (Blueprint $table) {
            // Define the foreign keys
            $table->unsignedBigInteger('tags_id');
            $table->unsignedBigInteger('man_doc_id');

            // Set the composite primary key
            $table->primary(['tags_id', 'man_doc_id']);

            // Define the foreign key constraints
            $table->foreign('tags_id')->references('id')->on('tags')->onDelete('cascade');
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
        Schema::dropIfExists('man_doc_tag');
    }
};

