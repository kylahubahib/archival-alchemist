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
        Schema::create('university_branches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('uni_id');
            $table->string('uni_branch_name');
            $table->timestamps();

            $table->foreign('uni_id')->references('id')->on('universities')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('university_branches');
    }
};
