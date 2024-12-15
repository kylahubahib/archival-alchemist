<?php

namespace App\Http\Controllers;


use App\Models\InstitutionAdmin;
use App\Models\Semester;
use App\Models\Faculty;
use App\Models\Student;


use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use carbon\Carbon;

class SemesterController extends Controller
{

    // public function __construct()
    // {
    //     // Apply 'can_add' access to 'create' and 'store' actions.
    //     $this->middleware('access:can_add')->only(['create', 'store']);
    //     // Apply 'can_edit' access to 'edit', 'update', and 'destroy' actions.
    //     $this->middleware('access:can_edit')->only(['edit', 'update', 'destroy']);
    // }

    public function getSemesters()
    {
        $user = Auth::user();

        $uniBranchId = null;

        if ($user->user_type === 'teacher') {
            $uniBranchId = $user->faculty->uniBranchId;
        } else if ($user->user_type === 'institution_admin') {
            $uniBranchId = $user->institution_admin->uniBranchId;
        } else if ($user->user_type === 'student') {
            $uniBranchId = $user->student->uniBranchId;
        }

        return response()->json($uniBranchId);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $uniBranchId = Auth::user()->institution_admin->institution_subscription->uni_branch_id;

        if ($uniBranchId) {
            $semesters = Semester::where('uni_branch_id', $uniBranchId)->get();
            return response()->json($semesters);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'start_sy' => 'required|string',
            'end_sy' => 'required|string'
        ]);

        \Log::info('Data passed: ', $request->all());


        $uniBranchId = Auth::user()->institution_admin->institution_subscription->uni_branch_id;
        $schoolYear = $request->input('start_sy') . '-' . $request->input('end_sy');

        if ($uniBranchId) {
            Semester::create([
                'name' => $request->name,
                'start_date' => Carbon::parse($request->start_date),
                'end_date' => Carbon::parse($request->end_date),
                'uni_branch_id' => $uniBranchId,
                'school_year' => $schoolYear
            ]);


            return back()->with('success', 'Semester created successfully.');
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'start_sy' => 'required|string',
            'end_sy' => 'required|string',
            'status' => 'required|string'
        ]);

        \Log::info('Data passed: ', $request->all());

        $schoolYear = $request->input('start_sy') . '-' . $request->input('end_sy');
        $semester = Semester::find($id);

        $semester->update([
            'name' => $request->name,
            'start_date' => Carbon::parse($request->start_date),
            'end_date' => Carbon::parse($request->end_date),
            'school_year' => $schoolYear,
            'status' => $request->status
        ]);


        return back()->with('success', 'Semester updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
