<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use App\Models\Section;
use App\Models\ClassModel;
use App\Models\ManuscriptProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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

}
