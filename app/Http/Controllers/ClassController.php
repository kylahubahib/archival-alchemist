<?php

// App\Http\Controllers\ClassController.php

namespace App\Http\Controllers;

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

use App\Notifications\UserNotification;

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

            return response()->json(['message' => 'Section created successfully!'], 201);
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


    public function getGroupMembers(Request $request)
    {
        Log::info('Route accessed with GET method');

        // Retrieve all group members with their associated user information
        $groupMembers = GroupMember::with('user')->get();

        // Log the retrieved group members with their users
        Log::info('Retrieved group members', ['groupMembers' => $groupMembers->toArray()]);

        return response()->json($groupMembers); // Return the full group members with users

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


    public function storeAssignedTask(Request $request, $section_id) {
        Log::info('Store Task Request Data:', $request->all());

        $validatedData = $request->validate([
            'title' => 'required|string',
            'instructions' => 'nullable|string',
            'startdate' => 'required|string',
            'duedate' => 'required|string',
        ]);

        // Process task storage logic
        try {
            $task = new AssignedTask();
            $task->section_id = $section_id;
            $task->task_title = $validatedData['title'];
            $task->task_instructions = $validatedData['instructions'];
            $task->task_startdate = Carbon::parse($validatedData['startdate'])->format('Y-m-d H:i:s');
            $task->task_duedate = Carbon::parse($validatedData['duedate'])->format('Y-m-d H:i:s');
            $task->save();

        } catch (\Exception $e) {
            // Handle any exception that may occur
            dd($e->getMessage()); // For debugging
        }
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

            return response()->json(['success' => true, 'message' => 'Feedback stored successfully']);
        } catch (\Exception $e) {
            // Handle any exception that may occur
            Log::error('Error storing feedback:', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error storing feedback'], 500);
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
            DB::enableQueryLog();

            // Fetch classes with proper joins
            // $classes = Section::join('group_members', 'sections.id', '=', 'group_members.section_id')
            // ->join('courses', 'courses.id', '=', 'sections.course_id')
            // ->where('group_members.stud_id', Auth::id())
            // ->select('sections.*', 'courses.*', 'group_members.*')
            // ->get();

            $section_id = GroupMember::where('stud_id', Auth::id())->pluck('section_id');

            $classes = Section::with(['course', 'group'])->where('id', $section_id)->get();

            // Log the SQL query for debugging
            Log::info('SQL Query: ' . DB::getQueryLog()[0]['query']);

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


    public function getgroupID()
    {
        // Fetch Group associated with the users ID
        $grouprecord = GroupMember::where('stud_id', Auth::id())->get();

        // Return the students record in group table as JSON
        return response()->json($grouprecord);
    }

}
