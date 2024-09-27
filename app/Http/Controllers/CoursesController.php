<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth; 

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
        \Log::info('ok');

        $request->validate([
            'dept_id' => 'required|integer',
            'course_name' => 'required|string|unique:courses',
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
