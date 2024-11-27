<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Department;
use App\Models\InstitutionAdmin;
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
        $authUser = Auth::user(); // Get the authenticated user
        $institution = InstitutionAdmin::where('user_id', $authUser->id)->first();

        if (!$institution) {
            Log::error("Institution not found for the logged-in user.");
            return;
        }

        foreach ($collection as $index => $row) {
            try {
                Log::info("Processing row {$index} for user with email: {$row['email']}");

                // Check if the user already exists
                $userExist = User::where('email', $row['email'])->first();
                if ($userExist) {
                    Log::info("User already exists: {$row['email']}");
                    continue;
                }

                // Generate a secure random password
                $pwd = Str::random(8);
                Log::info("Generated password for {$row['email']} is {$pwd}");

                // Create the new user
                $userType = Str::lower($row['type']);
                $newUser = User::create([
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
                Log::info("User created: {$newUser->id}");

                try {
                    Mail::to($row['email'])->send(new AccountCredentialsMail([
                        'name' => $newUser->name,
                        'email' => $newUser->email,
                        'password' => $pwd,
                        'message' => 'We are excited to inform you that your account has been successfully created on Archival Alchemist! You can now upload and store your capstone projects securely.'
                    ]));
                    Log::info("Welcome email sent to: {$row['email']}");
                } catch (\Exception $e) {
                    Log::error("Error sending email to {$row['email']}: " . $e->getMessage());
                }

                // Check if course exist. If not, it will create a new one
                $course = Course::with('department:id,uni_branch_id')
                    ->where(function ($query) use ($row) {
                        $query->where('course_name', $row['course'])
                              ->orWhere('course_acronym', $row['course']);
                    })
                    ->first();

                if (!$course) {
                    Log::info("Course not found. Creating new course for: {$row['course']}");

                    $departmentName = $row['department'] ?? 'General Department';
                    
                    // Check if department exist. If not, it will create a new one
                    $department = Department::where(function ($query) use ($departmentName) {
                        $query->where('dept_name', $departmentName)
                              ->orWhere('dept_acronym', $departmentName);
                    })->first();

                    if (!$department) {
                        $department = Department::create([
                            'dept_name' => $departmentName,
                            'dept_acronym' => Str::upper(substr($departmentName, 0, 3)),
                            'uni_branch_id' => $institution->uni_branch_id,
                        ]);
                        Log::info("New department created: {$department->dept_name}");
                    }

                    // Create new course
                    $course = Course::create([
                        'course_name' => $row['course'],
                        'course_acronym' => Str::upper(substr($row['course'], 0, 3)),
                        'department_id' => $department->id,
                    ]);

                    Log::info("New course created: {$course->course_name} under department: {$department->dept_name}");
                }

                // Get the university branch ID
                $uniBranchId = $course->department->uni_branch_id;

                // Create Student or Teacher profile
                if ($userType === 'student') {
                    Student::create([
                        'user_id' => $newUser->id,
                        'uni_branch_id' => $uniBranchId,
                        'course' => $course->course_name,
                    ]);
                    Log::info("Student profile created for user: {$newUser->id}");
                } elseif ($userType === 'teacher') {
                    Faculty::create([
                        'user_id' => $newUser->id,
                        'uni_branch_id' => $uniBranchId,
                        'course_id' => $course->id,
                    ]);
                    Log::info("Teacher profile created for user: {$newUser->id}");
                } else {
                    Log::warning("Unrecognized user type '{$userType}' for row {$index}");
                }
            } catch (Exception $e) {
                Log::error("Error processing row {$index} with email {$row['email']}: " . $e->getMessage());
            }
        }
    }
}
