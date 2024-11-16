<?php

// App\Http\Controllers\ClassController.php

namespace App\Http\Controllers;

use App\Models\AssignedTask;
use App\Models\Course;
use App\Models\Section;
use App\Models\User;
use App\Models\GroupMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClassController extends Controller
{
    public function fetchCourses(Request $request)
    {
        $courses = Course::where('dept_id', 1)->limit(25)->get();
        return response()->json($courses);
    }



    public function storeSection(Request $request)
    {
        // Log the request data
        Log::info('Store Section Request Data:', $request->all());

        $validatedData = $request->validate([
            'course_id' => 'required|integer|exists:courses,id', // Validate that course_id exists in courses table
            'subject_name' => 'required|string',
            'section_name' => 'required|string',
        ]);

        // Log the validated data
        Log::info('Validated Data:', $validatedData);
        Log::info('Checking for duplicate section', [
            'course_id' => $validatedData['course_id'],
            'subject_name' => $validatedData['subject_name'],
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
            $classes = Section::join('courses', 'sections.course_id', '=', 'courses.id')
            ->where('sections.ins_id', Auth::id())
            ->select('sections.*', 'courses.*')
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

        $section_id = $request->json('section_id');
        $instructorId = Auth::id();
        $studentNames = $request->json('students'); // Array of student names

        DB::beginTransaction();
        try {
            // Find the section by instructor ID and section_classcode
            $section = Section::where('ins_id', $instructorId)
                                ->where('id', $section_id)
                                ->first();

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


    public function fetchAssignedTask($section_id)
    {
        Log::info('Task accessed with GET method');

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



}
