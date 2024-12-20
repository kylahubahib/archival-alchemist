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
        Schema::table('users', function (Blueprint $table) {

            $table->string('google_user_id')->nullable()->unique(); 
            $table->string('google_access_token')->nullable();
            $table->string('google_refresh_token')->nullable();
            $table->datetime('google_token_expiry')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn('google_user_id');
            $table->dropColumn('google_access_token');
            $table->dropColumn('google_refresh_token');
            $table->dropColumn('google_token_expiry');
    });

    }
};
