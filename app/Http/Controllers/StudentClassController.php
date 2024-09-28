<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use App\Models\ClassModel;
use App\Models\ManuscriptProject;
use App\Models\Tags;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class StudentClassController extends Controller
{
public function storeManuscriptProject(Request $request)
{
    Log::info('Request Data:', $request->all());

    try {
        $validatedData = $request->validate([
            'man_doc_title' => 'required|string|max:255',
            'man_doc_adviser' => 'required|string|max:255',
            'man_doc_author' => 'required|array',
            'man_doc_author.*' => 'required|string|max:255',

            'tags_id' => 'nullable|array',
            'tags_id.*' => 'exists:tags,id',
            'man_doc_content' => 'required|file|mimes:pdf,docx|max:10240',
        ]);

        $filePath = $request->file('man_doc_content')->store('capstone_files');

        $author = $request->input('man_doc_author');
        $authorsString = implode(', ', $author);

        $manuscriptProject = ManuscriptProject::create([
            'man_doc_title' => $validatedData['man_doc_title'],
            'man_doc_adviser' => $validatedData['man_doc_adviser'],
            'man_doc_author' => $authorsString,
            'man_doc_content' => $filePath,
            'class_id' => $validatedData['class_id'] ?? null,
            'man_doc_author' => $authorsString,
        ]);

        if (isset($validatedData['tags_id'])) {
            $manuscriptProject->tags()->sync($validatedData['tags_id']);
        }

        return response()->json(['message' => 'Manuscript project uploaded successfully.'], 200);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Error uploading manuscript project.', 'errors' => $e->getMessage()], 422);
    }
}


// public function storeStudentClass(Request $request)
//     {
//         // Validate the incoming request
//         $request->validate([
//             'stud_id' => 'required|integer',
//             'class_code' => 'required|string',
//             'class_name' => 'required|string',
//         ]);

//         // Insert into the class table
//         ClassModel::create([
//             'stud_id' => $request->stud_id,
//             'class_code' => $request->class_code,
//             'class_name' => $request->class_name,
//         ]);

//         return response()->json(['success' => true]);
//     }



public function checkClassCode(Request $request)
{
    $request->validate([
        'class_code' => 'required|string',
    ]);

    $class = ClassModel::where('class_code', $request->class_code)->first();

    if ($class) {
        return response()->json([
            'exists' => true,
            'classDetails' => [
                'class_name' => $class->class_name,
                'ins_id' => $class->ins_id,
            ],
        ]);
    } else {
        return response()->json(['exists' => false]);
    }
}

public function storeStudentClass(Request $request)
{
    $request->validate([
        'class_code' => 'required|string',
        'class_name' => 'required|string',
        'ins_id' => 'required|integer',
    ]);

    $userId = Auth::id();
    //$user

    //\Log::info('in the student class');

    try {
        // Check if the user is already enrolled in the class
        $existingEnrollment = ClassModel::where([
            ['class_code', $request->class_code],
            ['stud_id', $userId], 
        ])->first();

        if ($existingEnrollment) {
            // User is already enrolled
            return response()->json(['success' => true, 'message' => 'Already enrolled']);
        } else {
            // Check if the class exists
            $class = ClassModel::where('class_code', $request->class_code)->first();

            if ($class) {
                // Insert the new enrollment
                ClassModel::create([
                    'class_code' => $request->class_code,
                    'class_name' => $request->class_name,
                    'ins_id' => $request->ins_id,
                    'stud_id' => $userId, // Store the user ID
                ]);

                return response()->json(['success' => true, 'message' => 'Joined class successfully']);
            } else {
                return response()->json(['success' => false, 'message' => 'Class code not found']);
            }
        }
    } catch (\Exception $e) {
        // Log the error and return a response
        Log::error('Error joining class: '.$e->getMessage());
        return response()->json(['success' => false, 'message' => 'An error occurred while joining the class.'], 500);
    }
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
// public function checkClassCode(Request $request)
// {
//     $classCode = $request->input('class_code');
//     $class = ClassModel::where('class_code', $classCode)->first();

//     if ($class) {
//         return response()->json(['exists' => true]);
//     } else {
//         return response()->json(['exists' => false], 404);
//     }
// }









public function getApprovedManuscripts(): JsonResponse
{
    try {
        $manuscripts = ManuscriptProject::where('man_doc_status', 'Y')->get()->unique('id');

        if ($manuscripts->isNotEmpty()) {
            return response()->json($manuscripts);
        } else {
            return response()->json(['message' => 'No approved manuscripts found.'], 404);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while fetching manuscripts.', 'details' => $e->getMessage()], 500);
    }
}




public function myApprovedManuscripts(): JsonResponse
    {
        try {
            $userId = Auth::id(); // Get the ID of the currently signed-in user

            // Retrieve approved manuscripts where the user is an author
            $manuscripts = ManuscriptProject::where('man_doc_status', 'Y')
                ->whereHas('author', function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                })
                ->get();

            if ($manuscripts->isNotEmpty()) {
                return response()->json($manuscripts);
            } else {
                return response()->json(['message' => 'No approved manuscripts found for the current user.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching manuscripts.', 'details' => $e->getMessage()], 500);
        }
    }

}






