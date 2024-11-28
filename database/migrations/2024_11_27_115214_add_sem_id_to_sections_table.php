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
            Schema::table('sections', function (Blueprint $table) {
                if (!Schema::hasColumn('sections', 'sem_id')) {
                    $table->unsignedBigInteger('sem_id')->nullable();
                    $table->foreign('sem_id')->references('id')->on('semesters')->onDelete('cascade');
                }
            });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            //
        });
    }
};
