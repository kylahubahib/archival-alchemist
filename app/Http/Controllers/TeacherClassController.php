<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
}
