<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\UserLog;
use Google\Service\Blogger\UserBlogs;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;


class CoursesController extends Controller
{

    /**
     * Display the courses under a specific department
     */

    //  public function __construct()
    //  {
    //      // Apply 'can_add' access to 'create' and 'store' actions.
    //      $this->middleware('access:can_add')->only(['create', 'store']);
    //      // Apply 'can_edit' access to 'edit', 'update', and 'destroy' actions.
    //      $this->middleware('access:can_edit')->only(['edit', 'update', 'destroy']);
    //  }

    public function getCourses(Request $request)
    {
        $id = $request->get('id');

        $courses = Course::with('department')
            ->where('dept_id', $id)->paginate(100);

        return response()->json([
            'courses' => $courses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // $request->validate([
        //     'dept_id' => 'required|integer',
        //     'course_name' => 'required|string|unique:courses',
        // ]);

        $request->validate([
            'dept_id' => 'required|integer',
            'course_acronym' => 'nullable|string',
            'course_name' => [
                'required',
                'string',
                Rule::unique('courses')->where(function ($query) use ($request) {
                    // Find the department associated with the given dept_id
                    $department = Department::find($request->dept_id);

                    // If the department exists, add conditions to the query
                    if ($department) {
                        return $query->where('dept_id', $request->dept_id)
                            ->whereExists(function ($subQuery) use ($department) {
                                $subQuery->select(DB::raw(1))
                                    ->from('departments')
                                    ->whereColumn('departments.id', 'courses.dept_id')
                                    ->where('departments.uni_branch_id', $department->uni_branch_id);
                            });
                    }

                    // If the department doesn't exist, just return the query
                    return $query;
                }),
            ],
        ]);

        $department = Department::find($request->dept_id);

        \Log::info('New Course: ', $request->all());

        $course = Course::create([
            'dept_id' => $request->dept_id,
            'course_name' =>  $request->course_name,
            'added_by' => Auth::user()->name,
            'course_acronym' => $request->course_acronym
        ]);

        //return redirect(route('manage-departments.index'))->with('success', 'Courses created successfully.');
        // return response()->json([
        //     'message' => 'Successfully created course!'
        // ]);

        // Log the course creation in UserLog
        UserBlogs::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Created Course", // Activity title
            'log_activity_content' => "Created course <strong>{$course->course_name}</strong>"
                . ($course->course_acronym ? " ({$course->course_acronym})" : "")
                . " under department <strong>{$department->dept_acronym}</strong>.",
        ]);

        return redirect()->back()->with(['success' => true]);
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'course_name' => 'required|string',
            'course_acronym' => 'nullable|string'
        ]);

        $course = Course::find($id);

        // Store the original course data for comparison
        $previousCourseName = $course->course_name;
        $previousCourseAcronym = $course->course_acronym;

        $course->update([
            'course_name' =>  $request->course_name,
            'course_acronym' => $request->course_acronym
        ]);

        // Build the UserLog message
        $logContent = "Updated course <strong>{$previousCourseName}</strong>";

        // Check if acronym has changed
        if ($request->course_acronym !== $previousCourseAcronym) {
            $logContent .= " (acronym changed from {$previousCourseAcronym} to {$request->course_acronym})";
        }

        // Check if the course name has changed
        if ($request->course_name !== $previousCourseName) {
            $logContent .= " to <strong>{$request->course_name}</strong>";
        }

        // Create UserLog
        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Updated Course", // Activity title
            'log_activity_content' => $logContent, // Log the previous and updated course details
        ]);

        return redirect()->back();
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return redirect()->back()->with(['error' => 'Course not found.']);
        }

        // Log the course deletion
        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Deleted Course", // Activity title
            'log_activity_content' => "Deleted course <strong>{$course->course_name}</strong> (acronym: {$course->course_acronym}).",
        ]);

        // Delete the course
        $course->delete();

        return redirect()->back()->with(['success' => true]);
    }


    /**
     * Reassign the courses
     */
    public function reassignFaculty(Request $request, string $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $courseId = $validated['course_id'];

        // Retrieve the course and faculty
        $course = Course::firstWhere('id', $courseId);
        $faculty = Faculty::firstWhere('course_id', $courseId);

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found for the given course'], 404);
        }

        $user = User::firstWhere('id', $faculty->user_id);
        if (!$user) {
            return response()->json(['message' => 'User associated with the faculty not found'], 404);
        }

        // Update the faculty's course assignment
        $faculty->update([
            'course_id' => $id,
        ]);

        // Log the activity
        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => "Reassigned Faculty",
            // Escape dynamic content to prevent XSS attacks
            'log_activity_content' => "Reassigned faculty <strong>" . e($user->name) . "</strong> to course <strong>" . e($course->course_acronym) . "</strong>.",
        ]);

        return response()->json([
            'message' => 'Successfully reassigned teacher!',
        ]);
    }

    /**
     * Unassign the courses
     */
    public function unassignFaculty(Request $request, string $id)
    {
        $courseId = $request->get('course_id');

        // Retrieve the faculty associated with the course
        $faculty = Faculty::where('course_id', $courseId)->first();

        // If no faculty is found, return an error
        if (!$faculty) {
            return response()->json(['message' => 'No faculty found for the specified course'], 404);
        }

        // Update the faculty's course assignment to null (unassign)
        $faculty->update([
            'course_id' => null
        ]);

        // Log the activity
        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Unassigned Faculty", // Activity title
            'log_activity_content' => "Unassigned faculty <strong>" . e($faculty->user->name) . "</strong> from course <strong>" . e($faculty->course->course_acronym) . "</strong>.",
        ]);

        return response()->json([
            'message' => 'Successfully unassigned courses! You can manually assign them in the courses tab.'
        ]);
    }



    public function getUnassignedCourses()
    {
        $courses = Course::where('dept_id', null)->get();

        return response()->json([
            'courses' => $courses
        ]);
    }

    public function getUnassignedFaculty()
    {
        $faculty = Faculty::where('course_id', null)->get();

        return response()->json([
            'faculty' => $faculty
        ]);
    }

    public function assignCourses(Request $request)
    {
        $deptId = $request->get('deptId');
        $courses = $request->get('courses');

        // Get the department for logging purposes
        $department = Department::firstWhere('id', $deptId); // Fetch the department

        // If no department is found, return an error
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        // Get the course names for logging purposes
        $courseNames = Course::whereIn('id', $courses)->pluck('course_acronym')->implode(', ');

        // Update the department assignment for the selected courses
        Course::whereIn('id', $courses)->update(['dept_id' => $deptId]);

        // Log the activity
        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Assigned Courses", // Activity title
            'log_activity_content' => "Assigned courses <strong>{$courseNames}</strong> to department <strong>{$department->dept_acronym}</strong>.",
        ]);

        return response()->json([
            'message' => 'Successfully assigned courses!'
        ]);
    }
}
