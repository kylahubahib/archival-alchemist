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
            $table->dropColumn('added_by');
            $table->unsignedBigInteger('ins_id')->nullable()->after('section_name');
            $table->foreign('ins_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            $table->dropForeign(['ins_id']);
            $table->dropColumn('ins_id');
            $table->string('added_by')->after('section_name');
        });
    }
};

