<?php

namespace App\Http\Controllers; 

use App\Models\Department;
use App\Models\Course;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Validation\Rule;



class DepartmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
                   
                    $departmentIds = $departments->pluck('id')->toArray();
                    // Get courses where the department_id matches the department IDs
                    $courses = Course::whereIn('dept_id', $departmentIds)->with(['department'])->paginate(100);

                    \Log::info('Courses: ', $courses->toArray());

                    // Get sections where the course_id matches the course IDs
                    $courseIds = $courses->pluck('id')->toArray();
                    $sections = Section::whereIn('course_id', $courseIds)->with(['course'])->paginate(100);
                }
            }
        } 

        
            \Log::info('Departments: ', $departments->toArray());

        return Inertia::render('InstitutionAdmin/Departments/Departments', [
            'departments' => $departments,
            'uniBranch_id' => $uniBranch_id,
            'courses' => $courses,
            'sections' => $sections
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
            'dept_name' => 'required|string|unique:departments',
            'dept_acronym' => 'nullable|string|unique:departments'
        ], [
            'dept_name.unique' => 'The department name has already been taken.',
            'dept_name.required' => 'The department name is required.',
            'dept_acronym.unique' => 'The department name has already been taken.',
        ]);

        \Log::info('Create Data: ', $request->all());

        Department::create([
            'uni_branch_id' => $request->uni_branch_id,
            'dept_name' =>  $request->dept_name,
            'added_by' => Auth::user()->name,
            'dept_acronym' => $request->dept_acronym
        ]);

        return redirect(route('manage-departments.index'))->with('success', 'Departments created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'dept_name' => 'required|string|unique:departments',
            'dept_acronym' => 'nullable|string|unique:departments'
        ], [
            'dept_name.unique' => 'The department name has already been taken.',
            'dept_name.required' => 'The department name is required.',
            'dept_acronym.unique' => 'The department name has already been taken.',
        ]);


        $department = Department::find($id);

        $department->update([
            'dept_name' =>  $request->dept_name,
            'dept_acronym' => $request->dept_acronym
        ]);

        return redirect(route('manage-departments.index'))->with('success', 'Departments created successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Department::find($id)->delete();

        return redirect(route('manage-departments.index'))->with('success', 'Department deleted successfully.');
    }    


     /**
     * Reassign the courses
     */
    public function reassignCourses(Request $request, string $id)
    {
        $deptId = $request->get('dept_id');
    
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
    
        Course::where('dept_id', $id)->update([
            'dept_id' => null
        ]);
    
        return response()->json([
            'message' => 'Successfully unassigned courses! You can manually assign them in the courses tab.'
        ]);
    }
    
    
}
