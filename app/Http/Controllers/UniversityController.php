<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\UniversityBranch;
use App\Models\InstitutionSubscription;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;


class UniversityController extends Controller
{
    public function index()
    {
        $universities = University::with('university_branch')->paginate(100);
        $uniBranches = UniversityBranch::with('university')->paginate(100);

        //\Log::info('University Controller');
        //\Log::info('Universities ', $uniBranches->toArray());

        return Inertia::render('SuperAdmin/Advanced/Universities/Universities', [
            'universities' => $universities,
            'uniBranches' => $uniBranches
        ]);

    }

    public function checkUniversitySubscription(Request $request)
    {
        $universityBranch = $request->get('uni_branch_id');
        //$user = Auth::user();

        \Log::info($universityBranch);

        // Check if the subscription exists for the university branch
        $checkIfExist = InstitutionSubscription::where('uni_branch_id', $universityBranch)->first();

        if ($checkIfExist) {
            return response()->json([
                'message' => 'This university already exists in our system.',
            ], 200); 
        }

        return response()->json([], 204);
    }


    public function getBranches(Request $request)
    {
        $id = $request->get('id');

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

    public function getUniversitiesWithBranches()
    {
        $universities = University::with('university_branch')->get();

        return response()->json($universities);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Find the university branch before validation
        $uniBranch = UniversityBranch::find($id);
        if (!$uniBranch) {
            return redirect()->back()->with('error', 'University branch not found.');
        }

        // Validate the incoming data
        $validatedData = $request->validate([
            'uni_branch_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('university_branches')->where(function ($query) use ($uniBranch) {
                    return $query->where('uni_id', $uniBranch->uni_id);
                })->ignore($id),
            ],
            'uni_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('universities', 'uni_name')->ignore($uniBranch->uni_id), // Correctly ignoring university based on `uni_id`
            ],
        ], [
            'uni_branch_name.required' => 'The university branch is required.',
            'uni_branch_name.unique' => 'The branch name has already been taken for this university.',
            'uni_name.required' => 'The university name is required.',
            'uni_name.unique' => 'The university name has already been taken.',
        ]);

        // Update university branch
        $uniBranch->update([
            'uni_branch_name' => $validatedData['uni_branch_name'],
        ]);

        // Find and update the associated university
        $uni = University::find($uniBranch->uni_id);
        if ($uni) {
            $uni->update([
                'uni_name' => $validatedData['uni_name'],
            ]);
        }

        return redirect(route('manage-universities.index'))->with('success', 'University successfully updated.');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    { 

    }

}