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
        Schema::table('custom_contents', function (Blueprint $table) {
            $table->text('content_title')->change();
            $table->longText('content_text')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('custom_contents', function (Blueprint $table) {
            $table->string('content_text')->change();
            $table->string('content_title')->change();
        });
    }
};
