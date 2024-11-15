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
        // Modify the 'class' table to drop the 'stud_id' foreign key and column
        Schema::table('class', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['stud_id']); // This drops the foreign key constraint

            // Drop the 'stud_id' column
            $table->dropColumn('stud_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback: Add the 'stud_id' column back and create the foreign key again
        Schema::table('class', function (Blueprint $table) {
            // Add the 'stud_id' column back
            $table->foreignId('stud_id')->nullable()->constrained('users')->onDelete('cascade');

            // Add the foreign key constraint back (if needed)
            $table->foreign('stud_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};




// <?php

// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     /**
//      * Run the migrations.
//      */
//     public function up(): void
//     {
//         Schema::create('class', function (Blueprint $table) {
//             $table->id();
//             $table->string('class_code', 8)->nullable();
//             $table->string('class_name', 60)->nullable();
//             $table->timestamps();

//             // Define foreign key for ins_id
//             $table->foreignId('ins_id')->constrained('id')->on('users')->onDelete('cascade');
//             // Make stud_id nullable
//             $table->foreignId('stud_id')->nullable()->constrained('id')->on('users')->onDelete('cascade');

//             // Define foreign key for section_id
//             $table->unsignedBigInteger('section_id')->nullable();
//             $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');

//         });
//     }

//     /**
//      * Reverse the migrations.
//      */
//     public function down(): void
//     {
//         Schema::dropIfExists('class');
//     }
// };
