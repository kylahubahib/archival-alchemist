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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->bigIncrements('plan_id');
            $table->string('plan_name');
            $table->decimal('plan_price');
            $table->string('plan_term');
            $table->string('plan_type');
            $table->unsignedInteger('plan_user_num');
            $table->decimal('plan_discount')->nullable();
            $table->unsignedInteger('free_trial_days')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
