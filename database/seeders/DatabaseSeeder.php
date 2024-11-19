<?php

namespace Database\Seeders;


//Seeders are used to populate the database with initial data. 
//This is useful for setting up default records, testing data, or populating lookup tables.

use App\Models\Student;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Add multiple users
        // User::factory(10)->create();


        // Manually add the user
        // User::factory()->create([
        //     'name' => 'Student',
        //     'email' => 'student@gmail.com',
        //     'password' => '12345678',
        //     'user_type' => 'student',
        // ]);

    }
}
