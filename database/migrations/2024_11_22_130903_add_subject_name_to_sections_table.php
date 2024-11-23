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
            $table->string('subject_name')->nullable();
        });

        Schema::table('manuscripts', function (Blueprint $table) {
            $table->string('man_doc_visibility', 1)->nullable();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            $table->dropColumn('subject_name');
        });

        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropColumn('man_doc_visibility');
        });
    }
};
