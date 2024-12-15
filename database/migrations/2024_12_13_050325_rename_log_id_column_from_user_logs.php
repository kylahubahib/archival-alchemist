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
        Schema::table('user_logs', function (Blueprint $table) {
            if (Schema::hasColumn('user_logs', 'id')) {
                $table->renameColumn('id', 'log_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_logs', function (Blueprint $table) {
            if (Schema::hasColumn('user_logs', 'log_id')) {
                $table->renameColumn('log_id', 'id');
            }
        });
    }
};
