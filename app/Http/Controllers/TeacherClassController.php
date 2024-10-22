<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use App\Models\Section;
use App\Models\ClassModel;
use App\Models\ManuscriptProject;
use App\Models\User;
use App\Models\ClassStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB; // Add this line
use Illuminate\Support\Facades\Log;

class TeacherClassController extends Controller
{
    //create class
    public function create(){

    }


        // // Fetch the courses and sections for the logged-in faculty
        // public function getCourses(Request $request)
        // {
        //     // Get the currently authenticated user
        //     $faculty = Faculty::where('user_id', $request->user()->id)->first();

        //     if (!$faculty) {
        //         return response()->json(['error' => 'Faculty not found'], 404);
        //     }

        //     // Get the department based on the faculty's university branch
        //     $department = Department::where('uni_branch_id', $faculty->uni_branch_id)->first();

        //     if (!$department) {
        //         return response()->json(['error' => 'Department not found'], 404);
        //     }

        //     // Get the courses in the department
        //     $courses = Course::where('dept_id', $department->id)->with('section')->get();

        //     // Return courses and their associated sections
        //     return response()->json([
        //         'faculty' => $faculty,
        //         'department' => $department,
        //         'courses' => $courses
        //     ]);
        // }

        public function DisplayGroupClass()
        {
            // Get the current authenticated user's ID
            $userId = Auth::id();

            // Fetch classes where ins_id matches the user's ID
            $classes = ClassModel::where('ins_id', $userId)->get();

            return response()->json(['classes' => $classes]);
        }

        public function index()
        {
            // Get the logged-in faculty
            $faculty = Faculty::with('university_branch')->where('user_id', Auth::id())->firstOrFail();

            // Get the department associated with the faculty
            $department = Department::where('uni_branch_id', $faculty->uni_branch_id)->first();

            // Get the courses in that department along with their sections
            $courses = Course::where('dept_id', $department->id)->with('sections')->get();

            // Retrieve classes where ins_id matches the current user's ID
            $classes = ClassModel::where('ins_id', Auth::id())->get();

            return response()->json([
                'courses' => $courses,
                'classes' => $classes, // Include the classes in the response
            ]);
        }




        public function newGroupClass(Request $request)
        {
            $request->validate([
                'class_name' => 'required|string',
            ]);

            $userId = Auth::id(); // Get the currently logged-in user's ID

            try {
                // Check if the class name already exists
                $existingClass = ClassModel::where('class_name', $request->class_name)->first();

                if ($existingClass) {
                    // If the class name already exists
                    return response()->json(['success' => false, 'message' => 'Group class already exists']);
                } else {
                    // Generate a unique class code
                    $classCode = $this->generateUniqueClassCode();

                    // Insert the new class with the generated class code
                    ClassModel::create([
                        'class_code' => $classCode,
                        'class_name' => $request->class_name,
                        'ins_id' => $userId,
                    ]);

                    return response()->json(['success' => true, 'message' => 'Group class successfully added']);
                }
            } catch (\Exception $e) {
                // Log the error and return a response
                Log::error('Error adding the class: '.$e->getMessage());
                return response()->json(['success' => false, 'message' => 'An error occurred while adding the group class.'], 500);
            }
        }

        /**
         * Generate a unique class code (6-8 alphanumeric characters) and ensure it doesn't already exist.
         */
        private function generateUniqueClassCode()
        {
            do {
                // Generate a random code between 6-8 characters, using letters and numbers
                $classCode = strtoupper(Str::random(rand(6, 8)));
            } while (ClassModel::where('class_code', $classCode)->exists());

            return $classCode;
        }



// // In your controller
// public function getManuscriptsByClass(Request $request)
// {
//     // $classCode = $request->input('class_code'); // Get the class code from the request
//     $ins_id = $request->input('ins_id'); // Get the class code from the request

//     // Query to join manuscripts and class tables
//     $manuscripts = ManuscriptProject::from('class as c')
//     ->leftJoin('manuscripts as m', 'c.id', '=', 'm.class_code')
//     ->select('c.id as id', 'c.class_code', 'c.class_name', 'm.id as id', 'm.man_doc_title', 'm.man_doc_status', 'm.created_at', 'm.updated_at')
//     ->where('c.ins_id', $ins_id)
//     ->get();


//     // Transform the statuses into user-friendly labels
//     $manuscripts->transform(function ($manuscript) {
//         switch ($manuscript->man_doc_status) {
//             case 'Y':
//                 $manuscript->man_doc_status = 'Approved';
//                 break;
//             case 'I':
//                 $manuscript->man_doc_status = 'In progress';
//                 break;
//             case 'X':
//                 $manuscript->man_doc_status = 'Declined';
//                 break;
//             default:
//                 $manuscript->man_doc_status = 'Pending';
//         }
//         return $manuscript;
//     });

//     return response()->json($manuscripts);
// }



public function getManuscriptsByClass(Request $request)
{
    $ins_id = $request->input('ins_id');
    $filter = $request->input('filter', null); // Get the filter from the request, default to null

    // Base query to join manuscripts and class tables
    $query = ManuscriptProject::from('class as c')
        ->leftJoin('manuscripts as m', 'c.id', '=', 'm.class_code')
        ->select('c.id as id', 'c.class_code', 'c.ins_id', 'c.class_name', 'm.id as id', 'm.man_doc_title', 'm.man_doc_status', 'm.created_at', 'm.updated_at')
        ->where('c.ins_id', $ins_id);

        //     // Query to join manuscripts and class tables
//     $manuscripts = ManuscriptProject::from('class as c')
//     ->leftJoin('manuscripts as m', 'c.id', '=', 'm.class_code')
//     ->select('c.id as id', 'c.class_code', 'c.class_name', 'm.id as id', 'm.man_doc_title', 'm.man_doc_status', 'm.created_at', 'm.updated_at')
//     ->where('c.ins_id', $ins_id)
//     ->get();

    // Apply filter condition based on the filter, if set
    if ($filter) {
        switch ($filter) {
            case 'approved':
                $query->where('m.man_doc_status', 'Y');
                break;
            case 'declined':
                $query->where('m.man_doc_status', 'X');
                break;
            case 'in_progress':
                $query->where('m.man_doc_status', 'I');
                break;
            case 'pending':
                $query->whereNull('m.id'); // Pending means no manuscript exists for that class
                break;
        }
    }

    $manuscripts = $query->get();

    // Transform statuses into user-friendly labels
    $manuscripts->transform(function ($manuscript) {
        switch ($manuscript->man_doc_status) {
            case 'Y':
                $manuscript->man_doc_status = 'Approved';
                break;
            case 'I':
                $manuscript->man_doc_status = 'In progress';
                break;
            case 'X':
                $manuscript->man_doc_status = 'Declined';
                break;
            default:
                $manuscript->man_doc_status = 'Pending';
        }
        return $manuscript;
    });

    return response()->json($manuscripts);
}




    public function updateManuscriptStatus(Request $request, $id)
    {
        // Validate the incoming request to ensure 'status' is present and valid
        $request->validate([
            'status' => 'required|string|in:Y,P,X'
        ]);

        try {
            // Find the manuscript by ID
            $manuscript = ManuscriptProject::findOrFail($id);

            // Update the manuscript's status
            $manuscript->man_doc_status = $request->input('status');
            $manuscript->save();

            // Return a success response
            return response()->json([
                'message' => 'Manuscript status updated successfully',
                'status' => $manuscript->man_doc_status
            ], 200);
        } catch (\Exception $e) {
            // Return an error response in case of failure
            return response()->json([
                'message' => 'Failed to update manuscript status',
                'error' => $e->getMessage()
            ], 500);
        }
    }





    // Class dropdown controller
    // Fetch students based on search query
    public function searchStudents(Request $request)
    {
        $name = $request->query('name');
        $students = User::where('name', 'LIKE', "%{$name}%")->get(['id', 'name']); // Get id and name

        return response()->json($students);
    }


    // public function addStudentsToClass(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'class_name' => 'required|string',
    //         'ins_id' => 'required|integer',
    //         'students' => 'required|array',
    //         'students.*' => 'integer',
    //     ]);

    //     $className = $request->input('class_name');
    //     $instructorId = $request->input('ins_id');
    //     $studentIds = $request->input('students');

    //     DB::beginTransaction();
    //     try {
    //         // Find the class by instructor ID and class name
    //         $class = ClassModel::where('ins_id', $instructorId)
    //                           ->where('class_name', $className)
    //                           ->first();

    //         // Check if the class exists
    //         if ($class) {
    //             // Get existing student IDs from the class
    //             $existingStudentIds = explode(',', $class->stud_id);

    //             // Initialize a count for newly added students
    //             $newlyAddedCount = 0;

    //             foreach ($studentIds as $studentId) {
    //                 // Check if the student is not already in the class
    //                 if (!in_array($studentId, $existingStudentIds)) {
    //                     $existingStudentIds[] = $studentId;
    //                     $newlyAddedCount++;
    //                 }
    //             }

    //             // Update the stud_id field with the new list of student IDs
    //             $class->stud_id = implode(',', $existingStudentIds);
    //             $class->save();

    //             DB::commit();

    //             return response()->json([
    //                 'success' => true,
    //                 'message' => "$newlyAddedCount student(s) added successfully."
    //             ]);
    //         } else {
    //             \Log::error('Class not found for instructor ID: ' . $instructorId . ' and class name: ' . $className);
    //             return response()->json(['message' => 'Class not found.'], 404);
    //         }
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         \Log::error('Error adding students: ' . $e->getMessage());
    //         return response()->json(['message' => 'An error occurred while adding students.'], 500);
    //     }
    // }


    public function addStudentsToClass(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'class_name' => 'required|string',
            'class_code' => 'required|string',
            'ins_id' => 'required|integer',
            'students' => 'required|array',
            'students.*' => 'string', // Expecting student names as strings
        ]);

        $className = $request->input('class_name');
        $classCode = $request->input('class_code');
        $instructorId = $request->input('ins_id');
        $studentNames = $request->input('students'); // Array of student names

        DB::beginTransaction();
        try {
            // Find the class by instructor ID and class name
            $class = ClassModel::where('ins_id', $instructorId)
                                ->where('class_name', $className)
                                ->first();

            if ($class) {
                Log::info('Adding students to class', [
                    'instructor_id' => $instructorId,
                    'class_name' => $className,
                    'class_code' => $classCode,
                    'students' => $studentNames,
                ]);

                // Convert student names to their corresponding user IDs
                $newStudentIds = $this->getUserIdsByNames($studentNames);

                if (!$newStudentIds) {
                    return response()->json(['message' => 'One or more students not found.'], 404);
                }

                // Insert into the class_students table using the ClassStudent model
                foreach ($newStudentIds as $studentId) {
                    // Check if the student is already in the class using Eloquent
                    $exists = ClassStudent::where('class_id', $class->id)
                                          ->where('stud_id', $studentId)
                                          ->exists();

                    if (!$exists) {
                        ClassStudent::create([
                            'class_id' => $class->id,
                            'stud_id' => $studentId,
                        ]);
                    } else {
                        Log::warning("Student already exists in class", [
                            'class_id' => $class->id,
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

    /**
     * Convert an array of student names to their corresponding user IDs
     */
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

}
