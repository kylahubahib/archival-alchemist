<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('forum_post_id'); // Singular form
            $table->unsignedBigInteger('parent_id')->nullable()->after('comment');
            $table->foreign('parent_id')->references('id')->on('forum_comments')->onDelete('cascade');
            $table->foreign('forum_post_id')->references('id')->on('forum_posts')->onDelete('cascade'); // References forum_posts
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->text('comment');
            $table->timestamps();
        });
        
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_comments');
    }
};
