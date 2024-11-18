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
        Schema::create('access_controls', function (Blueprint $table) {
            $table->bigIncrements('access_id');
            $table->unsignedBigInteger('user_id');
            $table->string('role');
            $table->boolean('dashboard_access');
            $table->boolean('users_access');
            $table->boolean('archives_access');
            $table->boolean('subscriptions_and_billings_access');
            $table->boolean('user_reports_access');
            $table->boolean('user_feedbacks_access');
            $table->boolean('terms_and_conditions_access');
            $table->boolean('subscription_plans_access');
            $table->boolean('faqs_access');
            $table->boolean('advanced_access');
            $table->boolean('can_add');
            $table->boolean('can_edit');
            $table->boolean('can_delete');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_controls');
    }
};
