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
        Schema::table('manuscripts', function (Blueprint $table) {

            // $table->unsignedBigInteger('uni_branch_id')->nullable();

            // $table->foreignId('uni_branch_id')->references('id')->on('university_branches')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            //
        });
    }
};
