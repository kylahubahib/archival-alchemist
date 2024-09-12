<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth; 

class SectionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $id)
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
            'course_id' => 'required|integer',
            'section_name' => 'required|string|unique:sections',
        ]);

        \Log::info('New Section: ', $request->all());

        Section::create([
            'course_id' => $request->course_id,
            'section_name' =>  $request->section_name,
            'added_by' => Auth::user()->name
        ]);

        return redirect(route('manage-sections.index'))->with('success', 'Section created successfully.');
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
            'course_id' => 'required|integer',
            'section_name' => 'required|string',
        ]);

        $section = Section::find($id);

        $section->update([
            'course_id' => $request->dept_id,
            'course_name' =>  $request->course_name
        ]);

        return redirect(route('manage-sections.index'))->with('success', 'Section updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Section::find($id)->delete();

        return redirect(route('manage-sections.index'))->with('success', 'Section deleted successfully.');
    }
}
