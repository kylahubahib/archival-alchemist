<?php

// App\Http\Controllers\ClassController.php

namespace App\Http\Controllers;
use App\Models\Course;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ClassController extends Controller
{
    public function fetchCourses(Request $request)
    {
        $courses = Course::where('dept_id', 1)->limit(25)->get();
        return response()->json($courses);
    }

    public function storeSection(Request $request)
    {
        // Log the request data
        Log::info('Store Section Request Data:', $request->all());

        $validatedData = $request->validate([
            'course_id' => 'required|integer|exists:courses,id', // Validate that course_id exists in courses table
            'subject_name' => 'required|string',
            'section_name' => 'required|string',
        ]);

        // Log the validated data
        Log::info('Validated Data:', $validatedData);
        Log::info('Checking for duplicate section', [
            'course_id' => $validatedData['course_id'],
            'subject_name' => $validatedData['subject_name'],
            'ins_id' => Auth::id() // Log the logged-in user's ID as well
        ]);

        try {
            // Check if the section already exists with the same course, subject, and section name
            $existingSection = $this->checkDuplicateSection(
                $validatedData['course_id'],
                $validatedData['subject_name'],
                $validatedData['section_name'] // Pass section_name to check for unique combinations
            );

            if ($existingSection) {
                return response()->json(['message' => 'This class already exists for your course with the same section name.'], 400); // Conflict response
            }

            // Proceed with creating the new section
            $section = new Section();
            $section->course_id = $validatedData['course_id'];
            $section->subject_name = $validatedData['subject_name'];
            $section->section_name = $validatedData['section_name'];
            $section->ins_id = Auth::id();
            $section->save();

            Log::info('Section created successfully!', ['section_id' => $section->id]);

            return response()->json(['message' => 'Section created successfully!'], 201);
        } catch (\Exception $e) {
            Log::error('Error creating section:', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Failed to create section.'], 500);
        }


    }

    /**
     * Check if a section already exists for the current user (ins_id)
     */
    protected function checkDuplicateSection($courseId, $subjectName, $sectionName)
    {
        // Check if a section with the same course_id, subject_name, section_name, and ins_id exists
        return Section::where('course_id', $courseId)
                      ->where('subject_name', $subjectName)
                      ->where('section_name', $sectionName) // Include section_name in the check
                      ->where('ins_id', Auth::id()) // Ensure it's for the logged-in user
                      ->exists(); // Return true if exists, false otherwise
    }



}
