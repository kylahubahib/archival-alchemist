<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manuscripts', function (Blueprint $table) {
            $table->id();
            $table->string('man_doc_title', 255);
            $table->text('man_doc_description');
            $table->text('man_doc_content');
            $table->string('man_doc_status', 1)->default('X');
            $table->string('man_doc_visibility', 1)->default('X'); // if private or not
            $table->string('man_doc_adviser', 30);
            $table->bigInteger('man_doc_view_count')->default(0);
            $table->boolean('is_publish')->default(false);
            $table->decimal('man_doc_rating', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manuscripts');
    }
};
