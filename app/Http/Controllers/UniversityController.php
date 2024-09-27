<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\UniversityBranch;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class UniversityController extends Controller
{
    public function index()
    {
        $universities = University::with('university_branch')->get();
        $uniBranches = UniversityBranch::with('university')->paginate(100);

        \Log::info('Universities ', $uniBranches->toArray());
        
        return Inertia::render('SuperAdmin/Advanced/Universities/Universities', [
            'universities' => $universities,
            'uniBranches' => $uniBranches
        ]);

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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getUniversitiesWithBranches()
    {
        $universities = University::with('university_branch')->get();
        return response()->json($universities);
    }

}