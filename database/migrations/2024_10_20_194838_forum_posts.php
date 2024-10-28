<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ForumPosts extends Migration
{
    public function up()
    {
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->json('tags')->nullable(); // Tags stored as JSON array
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key referencing users
            $table->unsignedBigInteger('views')->default(0); // View count field with default value 0
            $table->unsignedBigInteger('comments')->default(0); // Comment count field with default value 0
            $table->timestamps(); // Automatically manages created_at and updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('forum_posts');
    }
}
