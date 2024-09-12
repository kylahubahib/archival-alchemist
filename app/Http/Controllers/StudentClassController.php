<?php

namespace App\Http\Controllers;
use App\Models\ClassModel;
use App\Models\ManuscriptProject;
use App\Models\Tags;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentClassController extends Controller
{
    public function storeManuscriptProject(Request $request)
{
    Log::info('Request Data:', $request->all());

    $validatedData = $request->validate([
        'man_doc_title' => 'required|string|max:255',
        'man_doc_adviser' => 'required|string|max:255',
        'tags_id' => 'nullable|array',
        'tags_id.*' => 'exists:tags,id',
        'man_doc_content' => 'required|file|mimes:pdf,docx|max:10240',
    ]);

    $filePath = $request->file('man_doc_content')->store('capstone_files');

    $manuscriptProject = ManuscriptProject::create([
        'man_doc_title' => $validatedData['man_doc_title'],
        'man_doc_adviser' => $validatedData['man_doc_adviser'],
        'man_doc_content' => $filePath,
        'class_id' => null,  // Set class_id to null
    ]);

    // Attach tags to the manuscript project
    if (!empty($validatedData['tags_id'])) {
        $manuscriptProject->tags()->attach($validatedData['tags_id']);

    }




    return response()->json(['message' => 'Manuscript project uploaded successfully!']);
}



    public function trackActivity(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'activity_description' => 'required|string|max:255',
        ]);

        // Logic for tracking activity (if needed, adapt as per your requirements)
        // For example, you could directly create an activity without associating it with a student if needed

        // Return a success message
        return redirect()->back()->with('success', 'Activity tracked successfully!');
    }

    public function approveProject(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'project_id' => 'required|exists:manuscripts,id',
        ]);

        // Find the manuscript project and update its approval status
        $manuscriptProject = ManuscriptProject::findOrFail($validatedData['project_id']);
        $manuscriptProject->update(['is_publish' => true]);

        // Return a success message
        return redirect()->back()->with('success', 'Project approved successfully!');
    }



//check the class code if it exist in the class database
public function checkClassCode(Request $request)
{
    $classCode = $request->input('class_code');
    $class = ClassModel::where('class_code', $classCode)->first();

    if ($class) {
        return response()->json(['exists' => true]);
    } else {
        return response()->json(['exists' => false], 404);
    }
}




public function getApprovedManuscript()
{
    $manuscript = ManuscriptProject::where('man_doc_status', 'Y')->first();

    if ($manuscript) {
        return response()->json($manuscript);
    }

    return response()->json(['error' => 'No approved manuscript found.'], 404);
}

}
