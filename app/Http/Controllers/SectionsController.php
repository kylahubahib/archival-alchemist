<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Faculty;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\Course;
use App\Models\Department;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Log;

use App\Notifications\InstitutionAdminNotification;

class SectionsController extends Controller
{


     /** 
     * Display the sections under a specific course
     */
    public function getSections(Request $request)
    {
        $id = $request->get('id');
        
        $sections = Section::with(['course', 'user'])->where('course_id', $id)->paginate(100);

        \Log::info($sections);

       return response()->json([
            'sections' => $sections
       ]);
    }

    
    /**
     * Store a newly created resource in storage.
     */
    public function index()
    {
        
        // Get the university branch ID of the logged-in institution admin
        $uniBranchId = Auth::user()->institution_admin->institution_subscription->uni_branch_id;

        if ($uniBranchId) {

            // Get all the faculties associated with that university branch
            $facultiesIds = Faculty::where('uni_branch_id', $uniBranchId)
                        ->pluck('user_id')
                        ->toArray();

            // Check if any faculties were found
            if (empty($facultiesIds)) {
                Log::warning("No faculties found for university branch ID: $uniBranchId");
                $sections = []; 

            } else {
                $sections = Section::with(['course', 'user'])
                        ->whereIn('ins_id', $facultiesIds)
                        ->get();

                Log::info($sections->toArray());
                
                // Check if no sections are found for the faculty user IDs
                if ($sections->isEmpty()) {
                    Log::warning("No sections found for faculties with ins_ids: " . implode(',', $facultiesIds));
                }

            }

        } else {
            Log::warning('No university branch ID found for the logged-in institution admin.');
            $sections = [];
        }

        $departments = Department::with('course')
            ->where('uni_branch_id', $uniBranchId)->get();

        $departmentIds = $departments->pluck('id')->toArray();

        $courses = Course::whereIn('dept_id', $departmentIds)->get();

        $semester = Semester::where('uni_branch_id', $uniBranchId)
        ->orderBy('start_date', 'desc')
        ->get();



        return Inertia::render('InstitutionAdmin/Section/Sections', [
            'sections' => $sections,
            'departments' => $departments,
            'courses' => $courses, 
            'semester' => $semester
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

    
    public function filterSectionsByCourse(Request $request)
    {
        $filter = $request->get('filter');
        $id = $request->get('id');

        if($filter === 'Course')
        {
            $filteredData = Course::where('dept_id', $id);
        }

        return response()->json($filteredData);
    }

    
    public function filterSectionsByFaculty(Request $request)
    {
        $filter = $request->get('filter');
        $id = $request->get('id');

        if($filter === 'Course')
        {
            $filteredData = Course::where('dept_id', $id);
        }

        return response()->json($filteredData);
    }

    
    public function filterSectionsBySemester(Request $request)
    {
        $filter = $request->get('filter');
        $id = $request->get('id');

        if($filter === 'Course')
        {
            $filteredData = Course::where('dept_id', $id);
        }

        return response()->json($filteredData);
    }
}
