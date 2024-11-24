<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            // Check if 'ins_id' column already exists before adding it
            if (!Schema::hasColumn('sections', 'ins_id')) {
                $table->unsignedBigInteger('ins_id')->nullable()->after('section_name');
                $table->foreign('ins_id')->references('id')->on('users')->onDelete('cascade');
            }

            // Check if the 'added_by' column exists before dropping it
            if (Schema::hasColumn('sections', 'added_by')) {
                $table->dropColumn('added_by');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            // Drop the foreign key and the 'ins_id' column
            $table->dropForeign(['ins_id']);
            $table->dropColumn('ins_id');
            
            // Add the 'added_by' column back
            $table->string('added_by')->after('section_name');
        });
    }
};


