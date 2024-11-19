<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateForumPostForumTagTable extends Migration
{
    public function up()
    {
        Schema::create('forum_post_forum_tag', function (Blueprint $table) {
            $table->foreignId('forum_post_id')->constrained('forum_posts')->onDelete('cascade');
            $table->foreignId('forum_tag_id')->constrained('forum_tags')->onDelete('cascade');
            $table->primary(['forum_post_id', 'forum_tag_id']); // Composite primary key
        });
    }

    public function down()
    {
        Schema::dropIfExists('forum_post_forum_tag');
    }
}
