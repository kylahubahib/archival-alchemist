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
     * Display the sections under a specific course
     */
    public function getSections(Request $request)
    {
        $id = $request->get('id');
        
        $sections = Section::with('course')
            ->where('course_id', $id)->paginate(100);

        \Log::info($sections);

       return response()->json([
            'sections' => $sections
       ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Log::info('ok');

        $request->validate([
            'course_id' => 'required|integer',
            'section_name' => 'required|string',
        ]);

        \Log::info('New Section: ', $request->all());

        Section::create([
            'course_id' => $request->course_id,
            'section_name' =>  $request->section_name,
            'added_by' => Auth::user()->name
        ]);

        // return response()->json([
        //     'message' => 'Successfully created a section!'
        // ]);

        return redirect()->back()->with(['success' => true]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'section_name' => 'required|string',
        ]);

        $section = Section::find($id);

        $section->update([
            'section_name' =>  $request->section_name
        ]);

        // return response()->json([
        //     'message' => 'Successfully updated section!'
        // ]);

        return redirect()->back()->with(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Section::find($id)->delete();

        return response()->json([
            'message' => 'Successfully deleted section!'
        ]);
    }
}
