<?php

namespace App\Http\Controllers;

use App\Models\Course;
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
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
            'added_by' => Auth::user()->name
        ]);

        return redirect(route('manage-departments.index'))->with('success', 'Courses created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'course_name' => 'required|string',
        ]);

        $course = Course::find($id);

        $course->update([
            'course_name' =>  $request->course_name
        ]);

        return redirect(route('manage-departments.index'))->with('success', 'Courses updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Course::find($id)->delete();

        return redirect(route('manage-departments.index'))->with('success', 'Courses deleted successfully.');
    }
}
