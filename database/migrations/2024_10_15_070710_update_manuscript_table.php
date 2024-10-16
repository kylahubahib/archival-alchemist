<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            // Rename class_id to class_code
            $table->renameColumn('class_id', 'class_code');

            // Add the new man_doc_description column
            $table->text('man_doc_description')->nullable()->after('man_doc_content');
        });
    }

    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            // Rollback: Rename class_code back to class_id
            $table->renameColumn('class_code', 'class_id');

            // Rollback: Drop man_doc_description column
            $table->dropColumn('man_doc_description');
        });
    }
};
