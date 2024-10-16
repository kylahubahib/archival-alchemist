<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use App\Models\Section;
use App\Models\ClassModel;
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



        public function index()
        {
            // Get the logged-in faculty
            $faculty = Faculty::with('university_branch')->where('user_id', Auth::id())->firstOrFail();

            // Get the department associated with the faculty
            $department = Department::where('uni_branch_id', $faculty->uni_branch_id)->first();

            // Get the courses in that department along with their sections
            $courses = Course::where('dept_id', $department->id)->with('sections')->get();

            return response()->json([
                'courses' => $courses,
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

}
