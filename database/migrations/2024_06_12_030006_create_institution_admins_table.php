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
        Schema::create('institution_admins', function (Blueprint $table) {
            $table->bigIncrements('ins_admin_id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->unsignedBigInteger('insub_id');
            $table->string('ins_admin_proof');
            $table->timestamps();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('insub_id')->references('insub_id')->on('institution_subscriptions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_admins');
    }
};
