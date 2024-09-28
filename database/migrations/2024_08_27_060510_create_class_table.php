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
            $table->string('class_code', 8)->nullable();
            $table->string('class_name', 60)->nullable();
            $table->timestamps();

            // Define foreign key for ins_id
            $table->foreignId('ins_id')->constrained('id')->on('users')->onDelete('cascade');
            // Make stud_id nullable
            $table->foreignId('stud_id')->nullable()->constrained('id')->on('users')->onDelete('cascade');

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
