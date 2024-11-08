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
        Schema::create('admin_registration_tokens', function (Blueprint $table) {
            $table->string('token')->unique();
            $table->string('name');
            $table->string('email');
            $table->string('user_type');
            $table->json('access');
            $table->boolean('used')->default(false);
            $table->timestamp('expires_at');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_registration_tokens');
    }
};
