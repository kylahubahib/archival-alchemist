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
        Schema::create('class', function (Blueprint $table) {
            $table->id();
            $table->string('class_code', 8)->unique()->nullable();
            $table->string('class_name', 60)->nullable();
            $table->timestamps();

            // Define foreign key for ins_id
            $table->foreignId('ins_id')->constrained('user_id')->on('faculties')->onDelete('cascade');
            $table->foreignId('stud_id')->constrained('user_id')->on('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class');
    }
};
