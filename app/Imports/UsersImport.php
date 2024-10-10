<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToCollection; // Allows the import of data as a collection
use Maatwebsite\Excel\Concerns\WithHeadingRow; // Ensures that the first row of the CSV file is treated as headings
use Illuminate\Support\Facades\Hash; // Provides hashing functionalities, like for creating secure passwords
use Illuminate\Support\Collection; // Handles collections of data
use Illuminate\Support\Str; // Provides string-related helper methods
use App\Models\User; // References the User model to interact with the users table in the database

class UsersImport implements ToCollection, WithHeadingRow
{
    /**
     * Handles the imported data row by row as a collection.
     * 
     * @param Collection $collection The collection of rows from the CSV file, where each row is an associative array (because of WithHeadingRow)
     */
    public function collection(Collection $collection)
    {
        // Iterate through each row in the imported collection
        foreach ($collection as $row) {
            //Logics to create account based on the csv data

            // $pwd = Str::password();
            
            // \Log::info($pwd);
            // $user = User::create([
            //     'name' => $row['name'],
            //     'email' => $row['email'],
            //     'password' => Hash::make($pwd),
            //     'uni_id_num' => $row['id_number'],
            //     'user_type' => $row['type'],
            //     'user_pic' => 'storage/profile_pics/default_pic.png',
            //     'user_status' => 'active',
            //     'user_dob' => $row['dob'],
            //     'is_premium' => true,
            // ]);

            // \Log::info($users->toArray());
        }
    }
}
