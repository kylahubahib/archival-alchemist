<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use App\Models\ClassModel;
use App\Models\ManuscriptProject;
use App\Models\Tags;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class FacultyClassController extends Controller
{
    public function generateClassCode(Request $request)
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

    public function storeFacultyClass(Request $request)
    {
        $request->validate([
            'class_code' => 'required|string',
            'class_name' => 'required|string',
            'ins_id' => 'required|integer',
        ]);

        $userId = Auth::id();

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

}
