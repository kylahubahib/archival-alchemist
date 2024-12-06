<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Faculty;
use App\Models\Department;
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


    public function __construct()
    {
        // Apply 'can_add' access to 'create' and 'store' actions.
        $this->middleware('access:can_add')->only(['create', 'store']);
        // Apply 'can_edit' access to 'edit', 'update', and 'destroy' actions.
        $this->middleware('access:can_edit')->only(['edit', 'update', 'destroy']);
    }

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



        \Log::info('New Course: ', $request->all());

        Course::create([
            'dept_id' => $request->dept_id,
            'course_name' =>  $request->course_name,
            'added_by' => Auth::user()->name,
            'course_acronym' => $request->course_acronym
        ]);

        //return redirect(route('manage-departments.index'))->with('success', 'Courses created successfully.');
        // return response()->json([
        //     'message' => 'Successfully created course!'
        // ]);

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

        $course->update([
            'course_name' =>  $request->course_name,
            'course_acronym' => $request->course_acronym
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Course::find($id)->delete();

        return redirect()->back()->with(['success' => true]);
    }


    /**
     * Reassign the courses
     */
    public function reassignFaculty(Request $request, string $id)
    {
        $courseId = $request->get('course_id');

        Faculty::where('course_id', $courseId)->update([
            'course_id' => $id
        ]);

        return response()->json([
            'message' => 'Successfully reassigned teacher!'
        ]);
    }

    /**
     * Unassign the courses
     */
    public function unassignFaculty(Request $request, string $id)
    {
        $courseId = $request->get('course_id');

        Faculty::where('course_id', $courseId)->update([
            'course_id' => null
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

        Course::whereIn('id', $courses)->update(['dept_id' => $deptId]);

        return response()->json([
            'message' => 'Successfully assigned courses!'
        ]);
    }
}
