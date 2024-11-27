<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionsTable extends Migration
{
    public function up()
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // Session ID
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade'); // Foreign key to 'users' table
            $table->text('payload'); // Session payload data
            $table->integer('last_activity')->index(); // Last activity timestamp
            $table->string('ip_address', 45)->nullable(); // Optional: IP address
            $table->text('user_agent')->nullable(); // Optional: User agent string
        });
    }

    public function down()
    {
        Schema::dropIfExists('sessions');
    }
}
