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
        // Schema::create('institution_subscriptions', function (Blueprint $table) {
        //     $table->id();
        //     $table->unsignedBigInteger('uni_branch_id');
        //     $table->unsignedBigInteger('plan_id');
        //     $table->string('insub_status')->default('Inactive');
        //     $table->decimal('total_amount');
        //     $table->string('insub_content');
        //     $table->unsignedInteger('insub_num_user');
        //     $table->date('start_date');
        //     $table->date('end_date');
        //     $table->timestamps();

        //     //$table->foreign('ins_admin_id')->references('id')->on('institution_admins')->onDelete('cascade');
        //     $table->foreign('uni_branch_id')->references('id')->on('university_branches')->onDelete('cascade');
        //     $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('cascade');
        // });

        Schema::create('personal_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('plan_id');
            $table->string('persub_status')->default('Inactive');
            $table->decimal('total_amount');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('cascade');
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //Schema::dropIfExists('institution_subscriptions');
        Schema::dropIfExists('personal_subscriptions');
    }
};
