<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;

class TeacherClassController extends Controller
{
    //create class
    public function create(){

    }


        // Fetch the courses and sections for the logged-in faculty
        public function getCourses(Request $request)
        {
            // Get the currently authenticated user
            $faculty = Faculty::where('user_id', $request->user()->id)->first();

            if (!$faculty) {
                return response()->json(['error' => 'Faculty not found'], 404);
            }

            // Get the department based on the faculty's university branch
            $department = Department::where('uni_branch_id', $faculty->uni_branch_id)->first();

            if (!$department) {
                return response()->json(['error' => 'Department not found'], 404);
            }

            // Get the courses in the department
            $courses = Course::where('dept_id', $department->id)->with('section')->get();

            // Return courses and their associated sections
            return response()->json([
                'faculty' => $faculty,
                'department' => $department,
                'courses' => $courses
            ]);
        }
}
