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
        Schema::create('courses', function (Blueprint $table) {
            $table->id(); // Creates `id` as BIGINT UNSIGNED PRIMARY KEY
            //$table->unsignedBigInteger('dept_id'); // Foreign key column
            $table->string('course_name');
            $table->string('added_by');
            $table->timestamps();

             //Foreign key constraint
            $table->foreign('dept_id')
                ->references('id') // Matches the primary key in `departments`
                ->on('departments')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
