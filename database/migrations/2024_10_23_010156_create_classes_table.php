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
        Schema::create('classes', function (Blueprint $table) {
            $table->bigIncrements('class_id');
            $table->unsignedBigInteger('fac_id');
            $table->unsignedBigInteger('sec_id');
            $table->string('class_code');
            $table->string('class_name');
            $table->enum('class_status', ['Active', 'Inactive']);
            $table->integer('max_stud_num');
            $table->timestamps();
            $table->foreign('fac_id')->references('fac_id')->on('faculties')->onDelete('cascade');
            $table->foreign('sec_id')->references('sec_id')->on('sections')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
