<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateForumTagsTable extends Migration
{
    public function up()
    {
        // Schema::create('forum_tags', function (Blueprint $table) {
        //     $table->id(); // This creates an unsigned big integer column as id
        //     $table->string('name')->unique();  // Tag name must be unique
        //     $table->timestamps();
        // });
    }

    public function down()
    {
        // Schema::dropIfExists('forum_tags');
    }
}
