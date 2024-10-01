<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropUserReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('user_reports');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reporter_id');
            $table->unsignedBigInteger('reported_id');
            $table->string('report_location');
            $table->string('report_type');
            $table->string('report_attachment')->nullable();
            $table->longText('report_desc');
            $table->string('report_status')->default('Pending');
            $table->date('closed_at')->nullable();
            $table->timestamps();

            
            $table->foreign('reporter_id')->references('id')->on('users')->onDelete('cascade');
        });


    }
}
