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
        Schema::table('institution_subscriptions', function (Blueprint $table) {
            $table->boolean('notify_renewal')->default(true)->after('insub_status');
        });

        Schema::table('personal_subscriptions', function (Blueprint $table) {
            $table->boolean('notify_renewal')->default(true)->after('persub_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('institution_subscriptions', function (Blueprint $table) {
            $table->dropColumn('notify_renewal');
        });

        Schema::table('personal_subscriptions', function (Blueprint $table) {
            $table->dropColumn('notify_renewal');
        });
    }
};
