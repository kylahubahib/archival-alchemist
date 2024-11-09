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
        Schema::create('departments', function (Blueprint $table) {
            $table->bigIncrements("dept_id");
            $table->unsignedBigInteger('uni_branch_id');
            $table->string('dept_name');
            $table->string('added_by');
            $table->timestamps();

            $table->foreign('uni_branch_id')->references('uni_branch_id')->on('university_branches')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
