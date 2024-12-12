<?php

// App\Http\Controllers\ClassController.php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\AssignedTask;
use App\Models\Course;
use App\Models\Faculty;
use App\Models\Section;
use App\Models\Semester;
use App\Models\User;
use App\Models\GroupMember;
use App\Models\RevisionHistory;
use App\Models\ManuscriptProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;


use Illuminate\Support\Facades\Storage;


use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile as GoogleDriveFile;
use Google\Service\Drive\Permission;
use App\Notifications\UserNotification;
use App\Mail\TeachersFeedbackMail;
use Illuminate\Support\Facades\Mail;

class ClassController extends Controller
{

    public function fetchCourses(Request $request)
    {
        $user = Auth::user()->load('faculty');
        $deptId = 1; // Default value for dept_id if no faculty is found

        // Ensure we have at least one faculty record
        if ($user->faculty->isNotEmpty()) {
            // Access the first faculty record (or modify to select based on other conditions)
            $faculty = $user->faculty->first();  // Or use some other condition to get the desired faculty

            $deptId = $faculty->dept_id;  // Now, dept_id is accessible on the Faculty model
        }

        if (!$deptId) {
            return response()->json(['error' => 'Department ID not found'], 400);
        }

        try {
            // Fetch courses based on the dept_id
            $courses = Course::where('dept_id', $deptId)->limit(25)->get();
        } catch (\Exception $e) {
            Log::error("Error fetching courses: " . $e->getMessage());
            return response()->json(['error' => 'Error fetching courses'], 500);
        }

        return response()->json($courses);
    }


    public function storeSection(Request $request)
    {
        // Log the request data
        Log::info('Store Section Request Data:', $request->all());

       // Log::info('Semester ID:', $request->query('sem_id'));
        $validatedData = $request->validate([
            'course_id' => 'required|integer|exists:courses,id', // Validate that course_id exists in courses table
            'subject_name' => 'required|string',
            'section_name' => 'required|string',
            'sem_id' => 'required|integer|exists:semesters,id', // Validate sem_id exists in the semesters table

        ]);

        // Log the validated data
        Log::info('Validated Data:', $validatedData);
        Log::info('Checking for duplicate section', [
            'course_id' => $validatedData['course_id'],
            'subject_name' => $validatedData['subject_name'],
            'sem_id' =>  $validatedData['sem_id'],
            'ins_id' => Auth::id() // Log the logged-in user's ID as well
        ]);

        try {
            // Check if the section already exists with the same course, subject, and section name
            $existingSection = $this->checkDuplicateSection(
                $validatedData['course_id'],
                $validatedData['subject_name'],
                $validatedData['section_name'] // Pass section_name to check for unique combinations
            );

            if ($existingSection) {
                return response()->json(['message' => 'This section already exists for your course with the same section name.'], 400); // Conflict response
            }

            $classcode = $this->generateUniqueClassCode();

            // Proceed with creating the new section
            $section = new Section();
            $section->course_id = $validatedData['course_id'];
            $section->subject_name = $validatedData['subject_name'];
            $section->section_name = $validatedData['section_name'];
            $section->section_classcode = $classcode;
            $section->sem_id = $validatedData['sem_id'];
            $section->ins_id = Auth::id();
            $section->save();

            Log::info('Section created successfully!', ['section_id' => $section->id]);

            return response()->json([
                'message' => 'Section created successfully!',
                'classCode' => $classcode,  // Added the classCode to the respons
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating section:', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Failed to create section.'], 500);
        }


    }


    public function generateUniqueClassCode()
    {
        do {
            // Generate a random 8-character alphanumeric string
            $classcode = Str::random(8);
        } while (Section::where('section_classcode', $classcode)->exists()); // Check if it already exists in the database

        return $classcode;
    }


    /**
     * Check if a section already exists for the current user (ins_id)
     */
    protected function checkDuplicateSection($courseId, $subjectName, $sectionName)
    {
        // Check if a section with the same course_id, subject_name, section_name, and ins_id exists
        return Section::where('course_id', $courseId)
                      ->where('subject_name', $subjectName)
                      ->where('section_name', $sectionName) // Include section_name in the check
                      ->where('ins_id', Auth::id()) // Ensure it's for the logged-in user
                      ->exists(); // Return true if exists, false otherwise
    }

    public function fetchClasses(Request $request)
    {
        try {

           // $classes = Section::with(['course'])->where('ins_id', Auth::id())->get();

        // Capture the semID from the request (either query or request body)

        $semID = $request->query('sem_id'); // sem_id sent from the frontend

        //Fetch classes for the authenticated user and filter by sem_id (semester ID)
        $classes = Section::with(['course'])   // Eager load the related course model
            ->where('ins_id', Auth::id())      // Filter by the authenticated instructor's ID
            ->where('sem_id', $semID)          // Filter by the semID passed from the frontend
            ->get();

            return response()->json($classes);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error fetching classes: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }


    public function addStudentsToClass(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'students' => 'required|array',
            'students.*' => 'string', // Expecting student names as strings
        ]);
        Log::info('Request data:', $request->all());

        $section_id = $request->input('section_id');
        $instructorId = Auth::id();
        $studentNames = $request->input('students'); // Array of student names

        Log::info('Section Id: ', (array)$section_id);
        Log::info('Student names: ', (array)$studentNames);

        DB::beginTransaction();

        try {
            // Find the section by instructor ID and section_classcode
            //Remove the where('ins_id', $instructorId) since id of section is already unique
            $section = Section::where('id', $section_id)->first();

            Log::info('Section Found: ', (array)$section);

            if ($section) {
                Log::info('Adding students to GroupMembers', [
                    'instructor_id' => $instructorId,
                    'section_id' => $section_id,
                    'students' => $studentNames,
                ]);

                // Convert student names to their corresponding user IDs
                $newStudentIds = $this->getUserIdsByNames($studentNames);

                if (!$newStudentIds) {
                    return response()->json(['message' => 'One or more students not found.'], 404);
                }

                // Insert into the group_members table using the GroupMember model
                foreach ($newStudentIds as $studentId) {
                    $exists = GroupMember::where('section_id', $section->id)
                                          ->where('stud_id', $studentId)
                                          ->exists();

                    if (!$exists) {
                        GroupMember::create([
                            'section_id' => $section->id,
                            'stud_id' => $studentId,
                        ]);
                    } else {
                        Log::warning("Student already exists in this section", [
                            'section_id' => $section->id,
                            'stud_id' => $studentId,
                        ]);
                    }
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => count($newStudentIds) . " student(s) added successfully."
                ]);

            } else {
                return response()->json(['message' => 'Class not found.'], 404);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding students: ', ['exception' => $e]);
            return response()->json(['message' => 'An error occurred while adding students.'], 500);
        }
    }



    public function addNewStudentsToClass(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'students' => 'required|array',
            'students.*' => 'string', // Expecting student names as strings
        ]);

        Log::info('Request data:', $request->all());
    // Fetching all request data
    $data = $request->all();  // or $data = $request->input('yourData')

    // Ensure the `man_doc_id` is a single value (not an array)
    $man_doc_id = $data['man_doc_id'];

    // Handle case where it's an array
    if (is_array($man_doc_id)) {
        $man_doc_id = $man_doc_id[0];  // Get the first element if it's an array
    }
        $section_id = $request->input('section_id');
        $group_id = $request->input('group_id');
        $task_id = $request->input('task_id');
        $instructorId = Auth::id();
        $studentNames = $request->input('students'); // Array of student names

        Log::info('Section Id: ', (array)$section_id);
        Log::info('Student names: ', (array)$studentNames);

        DB::beginTransaction();

        try {
            // Find the section by instructor ID and section_classcode
            //Remove the where('ins_id', $instructorId) since id of section is already unique
            $section = Section::where('id', $section_id)->first();

            Log::info('Section Found: ', (array)$section);

            if ($section) {
                Log::info('Adding students to GroupMembers', [
                    'instructor_id' => $instructorId,
                    'section_id' => $section_id,
                    'students' => $studentNames,
                    'task_id' => $task_id,
                    'group_id' => $group_id,
                ]);

                // Convert student names to their corresponding user IDs
                $newStudentIds = $this->getUserIdsByNames($studentNames);

                if (!$newStudentIds) {
                    return response()->json(['message' => 'One or more students not found.'], 404);
                }

                // Insert into the group_members table using the GroupMember model
                foreach ($newStudentIds as $studentId) {
                    // $exists = GroupMember::where('section_id', $section->id)
                    // ->where('stud_id', $studentId)
                    // ->whereNotNull('group_id') // Excludes records where group_id is null
                    // ->exists();
                    $exists = GroupMember::where('section_id', $section->id)
                    ->where('stud_id', $studentId)
                    ->whereNull('group_id') // Excludes records where group_id is null
                    ->first();  // Use first() to get the actual model, not exists()


                    if ($exists) {
                        // GroupMember::create([
                        //     'section_id' => $section->id,
                        //     'stud_id' => $studentId,
                        //     'task_id' => $task_id,
                        //     'group_id' => $group_id,

                        // ]);

                        Log::info('Updating GroupMember', [
                            'section_id' => $section->id,
                            'stud_id' => $studentId,
                            'task_id' => $task_id,
                            'group_id' => $group_id,
                        ]);

                        $exists->update([
                            'task_id' => $task_id,  // Example task_id
                            'group_id' => $group_id, // Example group_id
                        ]);

                        Author::create([
                            'user_id' => $studentId,
                            'man_doc_id' => $man_doc_id,
                        ]);

                        // Creates permission id for the new author
                        $this->addGoogleDocUserPermission($studentId, $man_doc_id);

                    } else {
                        Log::warning("No GroupMember record found for update", [
                            'section_id' => $section->id,
                            'stud_id' => $studentId,
                        ]);
                    }
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => count($newStudentIds) . " student(s) added successfully."
                ]);

            } else {
                return response()->json(['message' => 'Class not found.'], 404);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding students: ', ['exception' => $e]);
            return response()->json(['message' => 'An error occurred while adding students.'], 500);
        }
    }



    private function checkStudentInClass($stud_id)
    {
        // Fetch the user record by ID
        $user = User::where('id', $stud_id)->first();

        // Return the user record if found
        if ($user) {
            return $user;
        }

        // Return null if no user is found
        return null;
    }


    private function getUserIdsByNames(array $studentNames)
    {
        $userIds = [];
        foreach ($studentNames as $name) {
            $user = User::where('name', $name)->first();
            if ($user) {
                $userIds[] = $user->id;
            } else {
                Log::error("User not found: " . $name);
                return null; // Return null if any user is not found
            }
        }
        Log::info('User IDs: ' . implode(',', $userIds)); // Logging the user IDs
        return $userIds;
    }

    public function getCurrentUser(Request $request)
    {
        Log::info('Route accessed with GET method');

        // Authenticate the user
        if (!Auth::check()) {
            Log::info('No authenticated user found');
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $user = Auth::user();
        Log::info('Authenticated user found: ' . $user->id);


        return response()->json($user);
    }


    public function getGroupMembers(string $id)
    {
        Log::info('Route accessed with GET method');

        // Retrieve all group members with their associated user information
        $groupMembers = GroupMember::with('user')
            ->where('section_id', $id)
            ->get();

        // Log the retrieved group members with their users
        Log::info('Retrieved group members', ['groupMembers' => $groupMembers->toArray()]);

        return response()->json($groupMembers); // Return the full group members with users

    }


    public function getMyGroupMembers(Request $request, string $id)
    {
        $task_id = $request->input('task_id');
        $section_id = $request->input('section_id');

        // Correct the way to fetch the group ID
        $group_id = $this->groupID($section_id, $task_id);

        Log::info('Route accessed with GET method');
        // Log the extracted values for debugging
        Log::info('Received group_id and task_id:', [
            'group_id' => $group_id,
            'task_id' => $task_id,
        ]);

        if (!$group_id) {
            return response()->json(['message' => 'Group not found'], 404);
        }

        // Retrieve all group members with their associated user information
        $groupMembers = GroupMember::with('user')
            ->where('section_id', $id)
            ->where('group_id', $group_id)
            ->where('task_id', $task_id)
            ->get();

        // Log the retrieved group members with their users
        Log::info('Retrieved group members', ['groupMembers' => $groupMembers->toArray()]);

        return response()->json($groupMembers); // Return the full group members with users
    }

    public function groupID(string $section_id, string $task_id)
    {
        // Fetch the group associated with the user's ID, task_id, and section_id
        $groupRecord = GroupMember::where('stud_id', Auth::id()) // Assuming stud_id refers to the student's ID
            ->where('task_id', $task_id)
            ->where('section_id', $section_id)
            ->first(); // Use first() to retrieve a single record instead of get()

        if ($groupRecord) {
            // If a group record is found, return the group_id
            return $groupRecord->group_id;
        } else {
            // Return null or a custom error if no group record is found
            return null; // or throw an exception depending on your error handling preference
        }
    }


    public function getgroupID(Request $request)
    {
        $section_id = $request->query('section_id');
        $task_id = $request->query('task_id');

        // Fetch Group associated with the users ID
        $grouprecord = GroupMember::where('stud_id', Auth::id())
            ->where('task_id', $task_id)
            ->where('section_id', $section_id)
            ->get();

        // Return the students record in group table as JSON
        return response()->json($grouprecord);
    }


    public function deleteStudent($id)
    {
        try {
            $groupMember = GroupMember::where('stud_id', $id)->first();
            if ($groupMember) {
                $groupMember->delete();
                return response()->json(['message' => 'Student removed successfully'], 200);
            }
            return response()->json(['message' => 'Student not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error removing student'], 500);
        }
    }




    public function removeMembers(Request $request, $id)
    {
        try {
            // Ensure man_doc_id exists in the request
            $data = $request->all();
            if (empty($data['man_doc_id'])) {
                return response()->json(['message' => 'man_doc_id is required'], 400);
            }

            // If man_doc_id is an array, extract the first element
            $man_doc_id = is_array($data['man_doc_id']) ? $data['man_doc_id'][0] : $data['man_doc_id'];

            Log::info('Request data:', $data);
            Log::info('man_doc_id:', ['man_doc_id' => $man_doc_id]);

            // Fetch GroupMember by stud_id
            $groupMember = GroupMember::where('stud_id', $id)->first();

            if ($groupMember) {
                // Nullify group_id for this groupMember
                $groupMember->update(['group_id' => null]);
                Log::info('GroupMember updated', ['group_id' => null, 'stud_id' => $id]);

                $this->removeGoogleDocUserPermission($id, $man_doc_id);

                // Attempt to find and delete the Author record using the composite key
                $authorDeleted = Author::deleteByCompositeKey($man_doc_id, $id); // Use composite key delete

                if ($authorDeleted) {
                    Log::info("Deleted Author record", ['user_id' => $id, 'man_doc_id' => $man_doc_id]);
                } else {
                    Log::info("No Author record found to delete", ['user_id' => $id, 'man_doc_id' => $man_doc_id]);
                }

                return response()->json(['message' => 'Student removed successfully, group_id reset'], 200);
            } else {
                return response()->json(['message' => 'GroupMember not found'], 404);
            }

        } catch (\Exception $e) {
            Log::error('Error removing student: ' . $e->getMessage());
            return response()->json(['message' => 'Error removing student', 'error' => $e->getMessage()], 500);
        }
    }







    public function storeAssignedTask(Request $request, $section_id) {
        Log::info('Store Task Request Data:', $request->all());

        // Check if a task already exists for the given section_id
        $alreadyHaveTask = $this->checkTask($section_id);

        // If a task already exists, stop execution and return a response
        if ($alreadyHaveTask) {
            return response()->json([
                'message' => 'You can only add 1 task per section.'
            ], 400); // 400 Bad Request
        }

        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string',
            'instructions' => 'nullable|string',
            'startdate' => 'required|string',
            'duedate' => 'required|string',
        ]);

        // Process task storage logic
        try {
            // Only proceed with task creation if no task exists for the section
            $task = new AssignedTask();
            $task->section_id = $section_id;
            $task->task_title = $validatedData['title'];
            $task->task_instructions = $validatedData['instructions'];
            $task->task_startdate = Carbon::parse($validatedData['startdate'])->format('Y-m-d H:i:s');
            $task->task_duedate = Carbon::parse($validatedData['duedate'])->format('Y-m-d H:i:s');
            $task->save();

            return response()->json([
                'message' => 'Task successfully created.',
                'task' => $task
            ], 201); // 201 Created
        } catch (\Exception $e) {
            // Handle any exception that may occur during task creation
            return response()->json([
                'error' => 'An error occurred while saving the task.',
                'message' => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }


//check if section has task already, 1 task per secttion
    public function checkTask($section_id) {

        $existTask = AssignedTask::where('section_id', $section_id )->exists();

        // Return true if the task exists, false otherwise
        return $existTask;
    }


    // public function fetchAssignedTask($section_id)
    // {
    //     Log::info('STudent tas ID:', ['id' => 1]);

    //     Log::info('Task accessed with GET method');

    //     // Retrieve all tasks assigned to the given section_id
    //     $tasks = AssignedTask::where('section_id', $section_id) // Filter tasks by section_id
    //         ->select('id','task_title', 'task_instructions', 'task_startdate', 'task_duedate', 'section_id') // Only select required columns
    //         ->get(); // Retrieve all tasks for the given section_id

    //     // Log the retrieved tasks
    //     Log::info('Tasks Retrieved', ['tasks' => $tasks->toArray()]);

    //     return response()->json($tasks); // Return the tasks as a JSON response
    // }


    public function fetchAssignedTask($section_id)
    {
        Log::info('STudent tas ID:', ['id' => 1]);

    // Log the section_id with proper context as an array
    Log::info('Task accessed with GET method', ['section_id' => $section_id]);

        // Retrieve all tasks assigned to the given section_id
        $tasks = AssignedTask::where('section_id', $section_id) // Filter tasks by section_id
            ->select('id','task_title', 'task_instructions', 'task_startdate', 'task_duedate', 'section_id') // Only select required columns
            ->get(); // Retrieve all tasks for the given section_id

        // Log the retrieved tasks
        Log::info('Tasks Retrieved', ['tasks' => $tasks->toArray()]);

        return response()->json($tasks); // Return the tasks as a JSON response
    }



    public function specificAssignedTask($section_id, Request $request)
    {
        // Get taskID from query parameters (may be null)
        $taskID = $request->query('taskID');
    // Log the received section_id and taskID for debugging purposes
    Log::info('Fetching assigned task', [
        'section_id' => $section_id,
        'taskID' => $taskID
    ]);
        // Start the query to retrieve tasks for the given section_id
        $tasks = AssignedTask::where('section_id', $section_id)
        ->where('id', $taskID) // Add this line to filter by taskID
        ->select('task_title', 'task_instructions', 'task_startdate', 'task_duedate', 'section_id')
        ->get();

        // Return the tasks as a JSON response
        return response()->json($tasks);
    }


    public function storeFeedback(Request $request)
    {
        Log::info('Store Feedback Request Data:', $request->all());

        $validatedData = $request->validate([
            'comment' => 'required|string',
            'status' => 'required|string',
        ]);

        try {
            $history = new RevisionHistory();
            $history->ins_comment = $validatedData['comment'];
            $history->man_doc_id = $request->manuscript_id;
            $history->man_doc_status = $validatedData['status'];
            $history->ins_id = $request->ins_id; // Ensure these values are passed in the request
            $history->group_id = $request->group_id;
            $history->section_id = $request->section_id;
            $history->created_at = $request->manuscriptCreated;

            $history->save();

            $this->returnStudentWork($request->manuscript_id, $validatedData['status'], $validatedData['comment']);



            return response()->json(['success' => true, 'message' => 'Feedback stored successfully']);


        } catch (\Exception $e) {
            // Handle any exception that may occur
            Log::error('Error storing feedback:', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error storing feedback'], 500);
        }
    }

    private function returnStudentWork($manuscriptId, $feedbackStatus, $feedbackComment)
    {
        // $manuscriptId = $request->get('manuscript_id');
        Log::info("Starting 'sendForRevision' process for manuscript ID: $manuscriptId");

        // Find the manuscript
        $manuscript = ManuscriptProject::find($manuscriptId);

        if (!$manuscript || empty($manuscript->man_doc_adviser)) {
            Log::warning("Manuscript not found or invalid data. Manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Manuscript not found or invalid data.'], 404);
        }

        $manuscript->update(['man_doc_status' => $feedbackStatus]);
        $googleDocUrl = $manuscript->man_doc_content;
        $googleDocId = $this->extractGoogleDocId($googleDocUrl);

        if (!$googleDocId) {
            Log::warning("Invalid Google Doc URL for manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Invalid Google Doc URL.'], 400);
        }
        $keyFilePath = storage_path('app/document-management-438910-d2725c4da7e7.json');

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setAuthConfig($keyFilePath);
        $client->addScope(GoogleDrive::DRIVE_FILE);
        $client->setSubject('file-manager@document-management-438910.iam.gserviceaccount.com');

        $driveService = new GoogleDrive($client);


        $authors = Author::with('user')->where('man_doc_id', $manuscriptId)->get();
        // $emails = $authors->pluck('user.email')->toArray();

        switch($feedbackStatus) {
            case 'A':
                $feedbackStatus = 'Approved';
                break;
            case 'D':
                $feedbackStatus = 'Declined';
                break;
        }


        foreach ($authors as $author) {
            $email = $author->user->email;
            $permId = $author->permission_id;
            $user = $author->user;

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Log::warning('Invalid Email Address:', ['email' => $email]);
                continue;
            }

            if ($user) {
                $user->notify(new UserNotification([
                    'message' => "Your adviser has finished reviewing your manuscript titled '{$manuscript->man_doc_title}'. The current status of your manuscript is '{$feedbackStatus}'.",
                    'user_id' => $user->id
                ]));
            }

            Mail::to($user->email)->send(new TeachersFeedbackMail([
                'name' => $user->name,
                'manuscriptTitle' => $manuscript->man_doc_title,
                'feedbackStatus' => $feedbackStatus,
                'feedbackComment' => $feedbackComment
            ]));

            if($feedbackStatus === 'Approved')
            {
                $this->convertGoogleDocToPdf($driveService, $googleDocId, $manuscript->man_doc_title, $manuscript->id);
                return;
            }


            try {
                // Fetch existing permissions
                $permissions = $driveService->permissions->listPermissions($googleDocId);
                Log::info("Existing Permissions: ", ['permissions' => $permissions]);

                $permissionFound = false;

                // Delete the existing permission if found
                foreach ($permissions as $permission) {
                    if ($permission->getId() === $permId) {
                        $driveService->permissions->delete($googleDocId, $permission->getId());
                        Log::info("Deleted existing permission for: $email");
                        Log::info("Permission Id:", ['permissions' => $permission->getId()]);
                        Log::info("Permission Id in Author Table:", ['permissions' => $permId]);

                        $permissionFound = true;
                        break;
                    }
                }

                // Create a new permission for the user
                $newPermission = new Permission();
                $newPermission->setType('user');
                $newPermission->setRole('writer');
                $newPermission->setEmailAddress($email);
                $driveService->permissions->create($googleDocId, $newPermission, ['sendNotificationEmail' => false]);
                Log::info("Created new 'writer' permission for: $email");

                // If no permission found, log the error
                if (!$permissionFound) {
                    Log::warning("Permission not found for: $email. Skipping permission creation.");
                }


            } catch (Exception $e) {
                Log::error("Error deleting/creating permission for: $email", ['error' => $e->getMessage()]);
                return response()->json(['error' => 'Error setting permission: ' . $e->getMessage()], 500);
            }
        }

        return;
    }


        // Method to extract Google Doc ID from the URL
        private function extractGoogleDocId($url)
        {
            // Remove the base URL portion
            $baseUrl = "https://docs.google.com/document/d/";

            // Check if the URL starts with the expected base URL
            if (strpos($url, $baseUrl) === 0) {
                // Remove the base URL and return the remaining part of the URL as the document ID
                return substr($url, strlen($baseUrl));
            }

            return null;
        }


            // Converts docs into pdf file
   private function convertGoogleDocToPdf($driveService, $googleDocId, $title, $manuscriptId)
   {
       try {
           $file = $driveService->files->get($googleDocId, ['fields' => 'mimeType']);

           if ($file->mimeType !== 'application/vnd.google-apps.document') {
               Log::warning("File is not a Google Docs file. MimeType: {$file->mimeType}");
               throw new \Exception("Only Google Docs files can be exported to PDF.");
           }

           // Export as PDF
           $response = $driveService->files->export($googleDocId, 'application/pdf', ['alt' => 'media']);
           $pdfFilePath = public_path("storage/capstone_files/{$title}.pdf");
           file_put_contents($pdfFilePath, $response->getBody()->getContents());

           $manuscript = ManuscriptProject::find($manuscriptId);
           $manuscript->update([
               'man_doc_content' => "storage/capstone_files/{$title}.pdf",
               'is_publish' => 1,
               'man_doc_visibility' => 'Y'
           ]);

           Log::info("Google Doc converted to PDF: {$pdfFilePath}");
       } catch (\Exception $e) {
           Log::error("Error converting Google Doc to PDF: " . $e->getMessage());
           throw $e;
       }
   }


    public function fetchHistory(Request $request)
    {
        // Get manuscript_id from query parameters
        $manuscript_id = $request->query('manuscript_id');
        Log::info('Fetching Manuscript ID:', ['manuscript_id' => $manuscript_id]);

        $getHistory = DB::table('revision_history as r')
            ->join('manuscripts as m', 'r.man_doc_id', '=', 'm.id')
            ->where('r.man_doc_id', $manuscript_id)
            ->select(
                'r.id as revision_id',
                'r.ins_comment',
                'r.man_doc_id',
                'r.man_doc_status as revision_status',
                'r.ins_id',
                'r.group_id as revision_group_id',
                'r.section_id as revision_section_id',
                'r.created_at as revision_created_at',
                'r.updated_at as revision_updated_at',
                'm.man_doc_title',
                'm.man_doc_content',
                'm.man_doc_description',
                'm.man_doc_status as manuscript_status',
                'm.man_doc_visibility',
                'm.man_doc_adviser',
                'm.man_doc_view_count',
                'm.is_publish',
                'm.man_doc_rating',
                'm.created_at as manuscript_created_at',
                'm.updated_at as manuscript_updated_at',
                'm.class_code',
                'm.group_id as manuscript_group_id',
                'm.section_id as manuscript_section_id'
            )
            ->get();

        // Log the retrieved data for debugging

        Log::info('Retrieved History Data:', ['getHistory' => $getHistory->toArray()]);
        return response()->json($getHistory);
    }

    //STUDENT

    public function enrollInClass(Request $request)
    {
        $request->validate([
            'class_code' => 'required|string',
        ]);

        Log::info('Request data:', $request->all());
        DB::beginTransaction();

        try {
            // Check if the class exists in the Section table
            $class = Section::where('section_classcode', $request->class_code)->first();

            if (!$class) {
                return response()->json(['success' => false, 'message' => 'Class code not found']);
            }

            Log::info('Adding student to GroupMembers', [
                'ins_id' => $class->ins_id,
                'section_id' => $class->id,
                'stud_id' => Auth::id(),
            ]);

            // Check if the student is already enrolled
            $exists = GroupMember::where('section_id', $class->id)
                                 ->where('stud_id', Auth::id())
                                 ->exists();

            if (!$exists) {
                // Insert the student into the group members table
                GroupMember::create([
                    'section_id' => $class->id,
                    'stud_id' => Auth::id(),
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Student added successfully.',
                ]);
            } else {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Student already enrolled in this class.',
                ], 409);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error enrolling student: ', ['exception' => $e]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while enrolling the student.',
            ], 500);
        }
    }

    public function fetchStudentClasses(Request $request)
    {
        Log::info('Authenticated student ID: ' . Auth::id());

        try {
            // Enable query log to capture the actual SQL query

            // Fetch classes with proper joins
            // $classes = Section::join('group_members', 'sections.id', '=', 'group_members.section_id')
            // ->join('courses', 'courses.id', '=', 'sections.course_id')
            // ->where('group_members.stud_id', Auth::id())
            // ->select('sections.*', 'courses.*', 'group_members.*')
            // ->get();

            $section_ids = GroupMember::where('stud_id', Auth::id())->pluck('section_id');

            $classes = Section::with(['course', 'group'])->whereIn('id', $section_ids)->get();

            Log::info(Section::with(['course', 'group'])->whereIn('id', $section_ids)->get());


            // Log the fetched data for debugging
            Log::info('Fetched student classes:', $classes->toArray());

            return response()->json($classes);
        } catch (\Exception $e) {
            // Log the error for debugging

            Log::error('Error fetching classes: ' . $e->getMessage());
            Log::error('Query: ' . $e->getTraceAsString()); // Log detailed stack trace

            return response()->json(['error' => 'An error occurred while fetching classes.'], 500);
        }
    }



    public function getRecords(Request $request)
    {
        try {
            // Fetch the uni_branch_id for the authenticated user directly
            $facultyRecord = Faculty::where('user_id', Auth::id())->first(); // Fetch the first record for the authenticated user

            // If the faculty record is not found, return an error
            if (!$facultyRecord) {
                return response()->json(['message' => 'Faculty record not found'], 404);
            }

            $uni_ID = $facultyRecord->uni_branch_id; // Get the uni_branch_id

            // Fetch the semesters where the uni_branch_id matches
            $semester = Semester::where('uni_branch_id', $uni_ID)->get();

            // Return the semesters as a JSON response
            return response()->json($semester, 200);

        } catch (\Exception $e) {
            // Handle error and return a response
            return response()->json(['message' => 'Error fetching semester records', 'error' => $e->getMessage()], 500);
        }
    }



    // public function getUniID(Request $request)
    // {
    //     try {
    //         // Fetch the uni_branch_id where the user_id matches the authenticated user's ID
    //         $facultyRecord = Faculty::where('user_id', Auth::id())->first(); // Fetch the first record for the authenticated user

    //         // Check if the record is found
    //         if ($facultyRecord) {
    //             return response()->json(['uni_branch_id' => $facultyRecord->uni_branch_id], 200);
    //         } else {
    //             return response()->json(['message' => 'Faculty record not found'], 404);
    //         }

    //     } catch (\Exception $e) {
    //         // Handle error and return a response
    //         return response()->json(['message' => 'Error fetching uni_branch_id from faculty table', 'error' => $e->getMessage()], 500);
    //     }
    // }



        /**
     * Fetch manuscripts by group ID.
     *
     * @param  int  $groupId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getManuscriptsByGroup($groupId)
    {
        // Validate the input to ensure groupId is numeric
        if (!is_numeric($groupId)) {
            return response()->json(['error' => 'Invalid group ID'], 400);
        }
        // Fetch manuscripts associated with the group ID
        $manuscripts = ManuscriptProject::where('group_id', $groupId)->get();

        // Return the manuscripts as JSON
        return response()->json($manuscripts);
    }


    private function addGoogleDocUserPermission($userId, $manuscriptId)
    {
        Log::info('Start adding permission for new author...');

        $manuscript = ManuscriptProject::find($manuscriptId);

        if (!$manuscript) {
            Log::warning("Manuscript not found or invalid data. Manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Manuscript not found or invalid data.'], 404);
        }

        $googleDocUrl = $manuscript->man_doc_content;
        if (!$googleDocUrl) {
            Log::warning("Google Doc URL missing for manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Google Doc URL missing.'], 400);
        }

        $googleDocId = $this->extractGoogleDocId($googleDocUrl);
        if (!$googleDocId) {
            Log::warning("Invalid Google Doc URL for manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Invalid Google Doc URL.'], 400);
        }

        $keyFilePath = storage_path('app/document-management-438910-d2725c4da7e7.json');

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setAuthConfig($keyFilePath);
        $client->addScope(GoogleDrive::DRIVE_FILE);
        $client->setSubject(env('GOOGLE_SERVICE_ACCOUNT_EMAIL'));

        $driveService = new GoogleDrive($client);
        $author = Author::with('user')->where('user_id', $userId)->first();

        if (!$author || !$author->user) {
            Log::warning("Author or user not found for user ID: $userId");
            return response()->json(['error' => 'Author or user not found.'], 404);
        }

        $email = $author->user->email;

        try {
            $memberPermissionId = Author::where('user_id', Auth::id())->pluck('permission_id')->first();

            Log::info("Permission Id Found: ", ['id' => $memberPermissionId]);

            if (!$memberPermissionId) {
                Log::warning("Permission ID not found for user ID: " . Auth::id());
                return response()->json(['error' => 'Permission ID not found.'], 404);
            }

             // Fetch existing permissions
             $permissions = $driveService->permissions->listPermissions($googleDocId);
             Log::info("Existing Permissions: ", ['permissions' => $permissions]);

             $permissionRole = 'writer';

             // Delete the existing permission if found
             foreach ($permissions as $permission) {
                 if ($permission->getId() === $memberPermissionId) {
                    $permissionRole = $permission['role'];
                    break;
                 }
             }

            Log::info("Current Role: ", ['role' => $permissionRole]);

            $newPermission = new Permission();
            $newPermission->setType('user');
            $newPermission->setRole($permissionRole);
            $newPermission->setEmailAddress($email);

            $createdPermission = $driveService->permissions->create(
                $googleDocId,
                $newPermission,
                ['sendNotificationEmail' => false]
            );

            Log::info("Created new permission for: $email");

            $author->update(['permission_id' => $createdPermission->getId()]);

        } catch (Exception $e) {
            Log::error("Error creating permission for: $email", ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error setting permission.'], 500);
        }

        return;
    }



    private function removeGoogleDocUserPermission($userId, $manuscriptId)
    {
        $manuscript = ManuscriptProject::find($manuscriptId);

        if (!$manuscript) {
            Log::warning("Manuscript not found or invalid data. Manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Manuscript not found or invalid data.'], 404);
        }

        $googleDocUrl = $manuscript->man_doc_content;
        $googleDocId = $this->extractGoogleDocId($googleDocUrl);

        if (!$googleDocId) {
            Log::warning("Invalid Google Doc URL for manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Invalid Google Doc URL.'], 400);
        }

        $keyFilePath = storage_path('app/document-management-438910-d2725c4da7e7.json');

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setAuthConfig($keyFilePath);
        $client->addScope(GoogleDrive::DRIVE_FILE);
        $client->setSubject('file-manager@document-management-438910.iam.gserviceaccount.com');

        $driveService = new GoogleDrive($client);
        $author = Author::with('user')->where('user_id', $userId)->first();
        $email = $author->user->email;

        try {

            Log::info("Deleted existing permission for: $email");
            Log::info("Permission Id:", ['permissions' => $author->permission_id]);

            $driveService->permissions->delete($googleDocId, $author->permission_id);


        } catch (Exception $e) {
            Log::error("Error deleting permission for: $email", ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error deleting permission: ' . $e->getMessage()], 500);
        }


    }

}