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
            // Check if the column exists before adding it
            if (!Schema::hasColumn('sections', 'ins_id')) {
                $table->unsignedBigInteger('ins_id')->nullable()->after('section_name');
                $table->foreign('ins_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            // Drop the foreign key and column in the down method
            $table->dropForeign(['ins_id']);
            $table->dropColumn('ins_id');
        });
    }
};
