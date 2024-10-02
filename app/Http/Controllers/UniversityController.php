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
        $universities = University::with('university_branch')->paginate(100);
        $uniBranches = UniversityBranch::with('university')->paginate(100);

        \Log::info('University Controller');
        //\Log::info('Universities ', $uniBranches->toArray());

        return Inertia::render('SuperAdmin/Advanced/Universities/Universities', [
            'universities' => $universities,
            'uniBranches' => $uniBranches
        ]);

    }


    public function getBranches(Request $request)
    {
        $id = $request->get('id');
        // \Log::info('ID type: ' . gettype($id));  
        // \Log::info('ID value: ' . $id);

        if($id == 0){
            $uniBranches = UniversityBranch::with('university')->get();
        }
        else {
            $uniBranches = UniversityBranch::with('university')
            ->where('uni_id', $id)
            ->get();
        }


        return response()->json($uniBranches);
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
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

            // $uni = University::find($id);

            // $uni->update([
            //     'university_name' => $request->university_name,
            //]);
         
            $uniBranch = UniversityBranch::find($id);
            $uniBranch->update([
                'uni_branch_name' => $request->uni_branch_name,
            ]);

            return redirect(route('manage-universities.index'))->with('success', 'University successfully updated.');
            
         
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
