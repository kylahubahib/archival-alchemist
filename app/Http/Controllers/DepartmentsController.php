<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\UniversityBranch;
use App\Models\Course;
use App\Models\Section;
use App\Models\Faculty;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use App\Notifications\InstitutionAdminNotification;


class DepartmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    //  public function __construct()
    // {
    //     // Apply 'can_add' access to 'create' and 'store' actions.
    //     $this->middleware('access:can_add')->only(['create', 'store']);
    //     // Apply 'can_edit' access to 'edit', 'update', and 'destroy' actions.
    //     $this->middleware('access:can_edit')->only(['edit', 'update', 'destroy']);
    // }

    public function index()
    {
        // dd();

        // Initialize the departments variable as an empty collection
        $departments = collect();

        \Log::info('Entered dept index');

        // Get the authenticated user
        $user = Auth::user();

        // Get the user's institution admin record 
        $ins_admin = $user->institution_admin;

        if ($ins_admin) {
            // Get the institution subscription
            $ins_sub = $ins_admin->institution_subscription;

            if ($ins_sub) {
                // Get the university branch
                $uni_branch = $ins_sub->university_branch;

                if ($uni_branch) {
                    // Get the university branch ID
                    $uniBranch_id = $uni_branch->id;

                    // Get departments for the university branch
                    $departments = Department::where('uni_branch_id', $uniBranch_id)->paginate(100);

                    $branch = UniversityBranch::with('university')
                        ->where('id', $uniBranch_id)
                        ->first();

                    \Log::info('University Branch:', $branch->toArray());


                    // $departmentIds = $departments->pluck('id')->toArray();
                    // // Get courses where the department_id matches the department IDs
                    // $courses = Course::whereIn('dept_id', $departmentIds)->with(['department'])->paginate(100);

                    // \Log::info('Courses: ', $courses->toArray());

                    // Get sections where the course_id matches the course IDs
                    // $courseIds = $courses->pluck('id')->toArray();
                    // $sections = Section::whereIn('course_id', $courseIds)->with(['course'])->paginate(100);
                }
            }
        }





        \Log::info('Departments: ', $departments->toArray());

        return Inertia::render('InstitutionAdmin/Departments/Departments', [
            'departments' => $departments,
            'uniBranch_id' => $uniBranch_id,
            'branch' => $branch,
            // 'courses' => $courses,
            // 'sections' => $sections
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Department $departments)
    {
        return Inertia::render('InstitutionAdmin/Departments/Departments', [
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(Request $request)
    {
        \Log::info('ok');

        $request->validate([
            'uni_branch_id' => 'required|integer',
            'dept_name' => [
                'required',
                'string',
                Rule::unique('departments')->where(function ($query) use ($request) {
                    return $query->where('uni_branch_id', $request->uni_branch_id);
                }),
            ],
            'dept_acronym' => [
                'nullable',
                'string',
                Rule::unique('departments')->where(function ($query) use ($request) {
                    return $query->where('uni_branch_id', $request->uni_branch_id);
                }),
            ],
        ], [
            'dept_name.unique' => 'The department name has already been taken for this university.',
            'dept_name.required' => 'The department name is required.',
            'dept_acronym.unique' => 'The department acronym has already been taken for this university.',
        ]);

        \Log::info('Create Data: ', $request->all());

        $department = Department::create([
            'uni_branch_id' => $request->uni_branch_id,
            'dept_name' =>  $request->dept_name,
            'added_by' => Auth::user()->name,
            'dept_acronym' => $request->dept_acronym
        ]);

        $universityBranch = UniversityBranch::find($department->uni_branch_id);

        // Log the department creation in the UserLog
        UserLog::create([
            'user_id' => Auth::id(), // Log the activity for the currently authenticated user
            'log_activity' => "Created Department", // Activity title
            'log_activity_content' => "Created a new department named <strong>{$department->dept_name}</strong> with acronym <strong>{$department->dept_acronym}</strong> in university branch <strong>{$universityBranch->uni_branch_name}</strong>.", // Activity content
        ]);

        return redirect(route('manage-departments.index'))->with('success', 'Departments created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'dept_name' => [
                'required',
                'string',
                Rule::unique('departments')->where(function ($query) use ($request) {
                    return $query->where('uni_branch_id', $request->uni_branch_id);
                }),
            ],
            'dept_acronym' => [
                'nullable',
                'string',
                Rule::unique('departments')->where(function ($query) use ($request) {
                    return $query->where('uni_branch_id', $request->uni_branch_id);
                }),
            ],
        ], [
            'dept_name.unique' => 'The department name has already been taken for this university.',
            'dept_name.required' => 'The department name is required.',
            'dept_acronym.unique' => 'The department acronym has already been taken for this university.',
        ]);


        $department = Department::find($id);

        // Log the department details before update
        $previousDeptName = $department->dept_name;
        $previousDeptAcronym = $department->dept_acronym;

        $department->update([
            'dept_name' =>  $request->dept_name,
            'dept_acronym' => $request->dept_acronym
        ]);

        // Build the UserLog message
        $logContent = "Updated department <strong>{$previousDeptName}</strong>";

        // If acronym has changed, update it in the log
        if ($request->dept_acronym !== $previousDeptAcronym) {
            $logContent .= " (acronym changed from {$previousDeptAcronym} to {$request->dept_acronym})";
        }

        // Add dept_name change to log content if it changed
        if ($request->dept_name !== $previousDeptName) {
            $logContent .= " to <strong>{$request->dept_name}</strong>";
        }

        // Create UserLog
        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Updated Department", // Activity title
            'log_activity_content' => $logContent, // Log the previous and updated department details
        ]);

        return redirect(route('manage-departments.index'))->with('success', 'Departments created successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $id)
    {
        // Find the department to delete
        $department = Department::find($id);

        // Log the department name and acronym before deletion
        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Deleted Department", // Activity title
            'log_activity_content' => "Deleted department <strong>{$department->dept_name}</strong> (acronym: {$department->dept_acronym}).", // Log the department details
        ]);

        // Delete the department
        $department->delete();

        // Redirect back with success message
        return redirect(route('manage-departments.index'))->with('success', 'Department deleted successfully.');
    }

    /**
     * Reassign the courses
     */

    public function reassignCourses(Request $request, string $id)
    {
        $deptId = $request->get('dept_id');
        $course = Course::find($id);
        $department = Department::find($deptId);

        // Log the reassignment action before updating the courses
        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Reassigned Courses", // Activity title
            'log_activity_content' => "Reassigned <strong>{$course->course_acronym}</strong> to department <strong>{$department->dept_acronym}</strong>.",
        ]);

        Course::where('dept_id', $deptId)->update([
            'dept_id' => $id
        ]);

        return response()->json([
            'message' => 'Successfully reassigned courses!'
        ]);
    }


    /**
     * Unassign the courses
     */
    public function unassignCourses(string $id)
    {
        $department = Department::find($id);

        $course = Course::where('dept_id', $id)->update([
            'dept_id' => null
        ]);

        UserLog::create([
            'user_id' => Auth::id(), // Log the action by the currently authenticated user
            'log_activity' => "Unassigned Courses", // Activity title
            'log_activity_content' => "Unassigned <strong>{$course->course_acronym}</strong> from department <strong>{$department->dept_acronym}</strong>.",
        ]);

        return response()->json([
            'message' => 'Successfully unassigned courses! You can manually assign them in the courses tab.'
        ]);
    }

    public function getAllDepartment(string $id)
    {
        $departments = Department::with('course')->where('uni_branch_id', $id)->get();

        return response()->json([
            'departments' => $departments
        ]);
    }
}
