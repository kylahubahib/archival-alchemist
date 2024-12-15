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
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('uni_branch_id')->nullable();
            $table->string('role');

            // Creating new boolean columns
            $table->boolean('super_dashboard_access')->default(false);
            $table->boolean('super_users_access')->default(false);
            $table->boolean('super_archives_access')->default(false);
            $table->boolean('super_subscription_billing_access')->default(false);
            $table->boolean('super_user_reports_access')->default(false);
            $table->boolean('super_user_feedbacks_access')->default(false);
            $table->boolean('super_terms_and_conditions_access')->default(false);
            $table->boolean('super_subscription_plans_access')->default(false);
            $table->boolean('super_faqs_access')->default(false);
            $table->boolean('super_advanced_access')->default(false);
            $table->boolean('ins_students_access')->default(false);
            $table->boolean('ins_faculties_access')->default(false);
            $table->boolean('ins_coadmins_access')->default(false);
            $table->boolean('ins_departments_access')->default(false);
            $table->boolean('ins_sections_access')->default(false);
            $table->boolean('ins_subscription_billing_access')->default(false);
            $table->boolean('ins_archives_access')->default(false);

            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('uni_branch_id')->references('id')->on('university_branches')->onDelete('cascade'); // Automatically delete access_control when university branch is deleted
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
