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
        Schema::create('personal_subscriptions', function (Blueprint $table) {
            $table->id('persub_id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->unsignedBigInteger('plan_id');
            $table->string('persub_status')->default('Inactive');
            $table->decimal('total_amount');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('plan_id')->references('plan_id')->on('subscription_plans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_subscriptions');
    }
};
