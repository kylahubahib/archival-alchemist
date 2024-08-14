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
        Schema::create('forums', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('forum_title');
            $table->string('forum_status')->default('Active');
            $table->longText('forum_desc');
            $table->string('forum_type');
            $table->string('forum_attachment')->nullable();
            $table->integer('forum_view_count')->default(0);
            $table->integer('forum_like_count')->default(0);
            $table->integer('forum_dislike_count')->default(0);
            $table->timestamps();

            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('forum_tags', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tag_id');
            $table->unsignedBigInteger('forum_id');
            $table->timestamps();

            
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            $table->foreign('forum_id')->references('id')->on('forums')->onDelete('cascade');
        });


        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('forum_id');
            $table->longText('post_content');
            $table->integer('post_view_count')->default(0);
            $table->integer('post_like_count')->default(0);
            $table->timestamps();

            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('forum_id')->references('id')->on('forums')->onDelete('cascade');
        });

        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reporter_id');
            $table->unsignedBigInteger('reported_id');
            $table->string('report_type');
            $table->string('report_attachment')->nullable();
            $table->longText('report_desc');
            $table->string('report_status')->default('Pending');
            $table->date('closed_at');
            $table->timestamps();

            
            $table->foreign('reporter_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reported_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('from_id');
            $table->unsignedBigInteger('to_id');
            $table->longText('chat_message');
            $table->boolean('chat_is_seen')->default(false);
            $table->timestamps();

            
            $table->foreign('from_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('to_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('report_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('report_type_content');
            $table->timestamps();

            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->text('notif_content');
            $table->string('notif_type');
            $table->boolean('notif_is_seen')->default(false);
            $table->timestamps();

            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->integer('feedback_rating');
            $table->text('feedback_content')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forums');
        Schema::dropIfExists('forum_tags');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('user_reports');
        Schema::dropIfExists('chats');
        Schema::dropIfExists('report_types');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('feedbacks');
       
    }
};
