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
        Schema::create('capstone_documents', function (Blueprint $table) {
            $table->bigIncrements('cap_doc_id');
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('uni_branch_id');
            $table->string('cap_doc_title');
            $table->text('cap_doc_desc');
            $table->string('cap_doc_content');
            $table->enum('cap_doc_status', ['approved', 'pending', 'rejected']);
            $table->string('cap_doc_adviser');
            $table->integer('cap_doc_view_count')->default(0);
            $table->float('cap_doc_rating')->nullable();
            $table->text('cap_doc_citation')->nullable();
            $table->boolean('is_published')->default(0);
            $table->timestamps();

            $table->foreign('class_id')->references('class_id')->on('classes')->onDelete('cascade');
            $table->foreign('uni_branch_id')->references('uni_branch_id')->on('university_branches')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capstone_documents');
    }
};
