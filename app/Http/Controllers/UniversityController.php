<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function getUniversitiesWithBranches()
    {
        $universities = University::with('university_branch')->get();
        return response()->json($universities);
    }
}