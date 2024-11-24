<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateForumPostsTable extends Migration
{
    public function up()
    {
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->id(); // This creates an unsigned big integer column as id
            $table->string('title');
            $table->text('body');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key referencing users
            $table->integer('viewCount')->default(0);
            $table->unsignedBigInteger('comments')->default(0); // Comment count field with default value 0
            $table->timestamps(); // Automatically manages created_at and updated_at
        });

    }

    public function down()
    {
         Schema::dropIfExists('forum_posts');
    }
}
