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
        //This would check if the courses table already exists before attempting to create it.
        if (!Schema::hasTable('courses')) {
            Schema::create('courses', function (Blueprint $table) {
                $table->bigIncrements("course_id");
                $table->unsignedBigInteger('dept_id');
                $table->string('course_name');
                $table->string('added_by');
                $table->timestamps();

                $table->foreign('dept_id')->references('id')->on('departments')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
