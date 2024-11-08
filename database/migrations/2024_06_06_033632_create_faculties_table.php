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
        Schema::create('faculties', function (Blueprint $table) {
            $table->bigIncrements('fac_id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->unsignedBigInteger('uni_branch_id');
            $table->unsignedBigInteger('dept_id');
            $table->unsignedBigInteger('course_id');
            $table->string('fac_position');
            //$table->string('teacher_position');
            $table->timestamps();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('uni_branch_id')->references('uni_branch_id')->on('university_branches')->onDelete('cascade');
            $table->foreign('dept_id')->references('dept_id')->on('departments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};
