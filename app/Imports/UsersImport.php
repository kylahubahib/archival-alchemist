<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use Exception;

use App\Mail\AccountCredentialsMail;
use Illuminate\Support\Facades\Mail;

class UsersImport implements ToCollection, WithHeadingRow
{
    /**
     * Handles the imported data row by row as a collection.
     * 
     * @param Collection $collection The collection of rows from the CSV file, 
     * where each row is an associative array (because of WithHeadingRow)
     */
    public function collection(Collection $collection)
    {
        foreach ($collection as $index => $row) {
            try {
                // Log the start of processing a new row
                Log::info("Processing row {$index} for user with email: {$row['email']}");

                // Check if user already exists by email
                $userExist = User::where('email', $row['email'])->first();
                
                if ($userExist) {
                    Log::info("User already exists: {$row['email']}");
                    continue; // Skip this row if the user already exists
                }

                // Generate a secure password
                $pwd = Str::random(8);
                Log::info("Generated password for {$row['email']} is {$pwd}");

                $userType = Str::lower($row['type']);

                $user = User::create([
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'password' => Hash::make($pwd),
                    'uni_id_num' => $row['id_number'],
                    'user_type' => $userType,
                    'user_pic' => 'storage/profile_pics/default_pic.png',
                    'user_status' => 'active',
                    'user_dob' => $row['dob'],
                    'is_premium' => true,
                    'is_affiliated' => true,
                ]);
                Log::info("User created: {$user->id}");

                try {
                    Mail::to($row['email'])->send(new AccountCredentialsMail([
                        'name' => $user->name,
                        'email' => $user->email,
                        'password' => $pwd,
                        'message' => 'We are excited to inform you that your account has been successfully created on 
                        Archival Alchemist! You can now upload and store your capstone projects securely.'
                    ]));

                    Log::info("Welcome email sent to: {$row['email']}");
                } catch (\Exception $e) {
                    Log::error("Error sending email to {$row['email']}: " . $e->getMessage());
                }


                // Find the course and its university branch ID
                $course = Course::with('department:id,uni_branch_id')
                    ->where('course_name', $row['course'])
                    ->orWhere('course_acronym', $row['course'])
                    ->first();

                if (!$course || !$course->department) {
                    Log::error("Course or department not found for row {$index} with course: {$row['course']}");
                    continue; // Skip this row if course or department is missing
                }

                $uniBranchId = $course->department->uni_branch_id;

                // Create Student or Teacher based on user type
                if ($userType === 'student') {
                    Student::create([
                        'user_id' => $user->id,
                        'uni_branch_id' => $uniBranchId,
                        'course' => $course->course_name
                    ]);
                    Log::info("Student profile created for user: {$user->id}");
                } elseif ($userType === 'teacher') {
                    Faculty::create([
                        'user_id' => $user->id,
                        'uni_branch_id' => $uniBranchId,
                        'course_id' => $course->id
                    ]);
                    Log::info("Teacher profile created for user: {$user->id}");
                } else {
                    Log::warning("Unrecognized user type '{$userType}' for row {$index}");
                }
                
            } catch (Exception $e) {
                Log::error("Error processing row {$index} with email {$row['email']}: " . $e->getMessage());
            }
        }
    }
}
