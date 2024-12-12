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

    protected $userId;

    public function __construct($userId)
    {
        $this->userId = $userId; 
    }

    /**
     * Handles the imported data row by row as a collection.
     * 
     * @param Collection $collection The collection of rows from the CSV file, 
     * where each row is an associative array (because of WithHeadingRow)
     */
    public function collection(Collection $collection)
    {
        Log::info('Start processing csv...');

        $authUser = User::find($this->userId); 

        if (!$authUser) {
            Log::error("User not found with ID {$this->userId}");
            return;
        }

        $institution = InstitutionAdmin::with('institution_subscription')
            ->where('user_id', $authUser->id)->first();
        $uniBranchId = $institution->institution_subscription->uni_branch_id;

        Log::info('Uni Branch Id: ', ['uni_branch_id' => $uniBranchId]);
        

        if (!$institution) {
            Log::error("Institution not found for the logged-in user.");
            return;
        }

        foreach ($collection as $index => $row) {
            try {
                Log::info("Processing row {$index} for user with email: {$row['email']}");

                // Check if user already exists
                $userExist = User::where('email', $row['email'])->first();
                if ($userExist) {
                    Log::info("User already exists: {$row['email']}");
                    if($userExist->is_affiliated == 1)
                    {
                        $userExist->update([
                            'is_premium' => true
                        ]);

                        $userExist->notify(new UserNotification([
                            'message' => "Congratulations! Your account has been upgraded to premium status, thanks to your institution's active subscription. Enjoy exclusive access to premium features and resources!",
                            'user_id' => $userExist->id
                        ]));
                        
                    }

                    continue;
                }

                // Generate a secure random password
                $pwd = Str::random(8);

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

                Log::info("New user created with ID: {$newUser->id}, Email: {$newUser->email}");

                // Send account creation email
                try {
                    Mail::to($row['email'])->send(new AccountCredentialsMail([
                        'name' => $newUser->name,
                        'email' => $newUser->email,
                        'password' => $pwd,
                        'message' => 'Welcome to Archival Alchemist!',
                    ]));
                    Log::info("Welcome email sent to: {$row['email']}");
                } catch (Exception $e) {
                    Log::error("Failed to send email to {$row['email']}: " . $e->getMessage());
                }

                // Handle department
                $departmentName = $row['department'];
                $courseName = $row['course'];

                Log::info('Department Name: ', ['dept name' => $row['department']]);

                if($departmentName)
                {
                    $foundDept = Department::where('uni_branch_id', $uniBranchId)
                        ->where(function($query) use ($departmentName) {
                            $query->where('dept_name', $departmentName)
                                ->orWhere('dept_acronym', $departmentName);
                        })->first();

                    Log::info('Department Found: ', ['dept' => $foundDept]);

                    if($foundDept != null) {
                        Log::info('Existing Department Found');

                        $department = $foundDept;

                        $foundCourse = Course::where('dept_id', $foundDept->id)
                        ->where(function($query) use ($courseName) {
                            $query->where('course_name', $courseName)
                                ->orWhere('course_acronym', $courseName);
                        })->first();

                        if(!$foundCourse) {
                            $course = Course::create([
                                'course_name' => $courseName,
                                'course_acronym' => $courseName,
                                'dept_id' => $foundDept->id,
                                'added_by' => $authUser->name
                            ]);

                            Log::info('Course: ', ['course' => $course]);
                        } else {$course = $foundCourse;}

                    } else {
                        Log::info('New Department is created');

                        $department = Department::create([
                            'dept_name' => $departmentName,
                            'dept_acronym' => $departmentName,
                            'uni_branch_id' => $uniBranchId,
                            'added_by' => $authUser->name
                        ]);

                        Log::info('Department Created: ', ['dept' => $department]);

                        $course = Course::create([
                            'course_name' => $courseName,
                            'course_acronym' => $courseName,
                            'dept_id' => $department->id,
                            'added_by' => $authUser->name
                        ]);

                        Log::info('Course Created: ', ['course' => $course]);
                    }
                }
            

                // Profile creation
                if ($userType === 'student') {
                    Student::create([
                        'user_id' => $newUser->id,
                        'uni_branch_id' => $uniBranchId,
                        'course' => $course->course_name,
                    ]);
                    Log::info("Student profile created for user ID: {$newUser->id}, Course: {$course->course_name}");
                } elseif ($userType === 'teacher') {
                    Faculty::create([
                        'user_id' => $newUser->id,
                        'uni_branch_id' => $uniBranchId,
                        // 'course_id' => $course->id,
                        'dept_id' => $department->id
                    ]);
                    Log::info("Teacher profile created for user ID: {$newUser->id}, Course: {$course->course_name}");
                } else {
                    Log::warning("Unrecognized user type '{$userType}' for row {$index}");
                }

            } catch (Exception $e) {
                Log::error("Error processing row {$index} with email {$row['email']}: " . $e->getMessage());
            }
        }
    }



}
