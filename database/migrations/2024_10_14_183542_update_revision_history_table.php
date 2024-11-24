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
        // Comment out the migration code to prevent execution
        // Schema::table('revision_history', function (Blueprint $table) {
        //     $table->dropForeign(['stud_id']);
        //     $table->dropColumn('stud_id');
        //     $table->timestamp('uploaded_at')->nullable();
        //     $table->string('status')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Comment out the down method code
        // Schema::table('revision_history', function (Blueprint $table) {
        //     $table->dropColumn('uploaded_at');
        //     $table->dropColumn('status');
        // });
    }
};
