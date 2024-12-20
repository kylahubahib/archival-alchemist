<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use App\Models\Student;
use App\Models\Author;
use Illuminate\Support\Facades\File;
use Illuminate\Http\JsonResponse;
use App\Models\ClassModel;
use App\Models\Rating;
use App\Models\ManuscriptProject;
use App\Models\ManuscriptTag;
use App\Models\Group;
use App\Models\GroupMember;
use App\Models\AssignedTask;

use Illuminate\Support\Facades\DB;
use App\Models\Favorite;
use App\Models\Tags;
use App\Models\User;

use App\Models\ClassStudent;
use App\Models\Faculty;
use App\Models\RevisionHistory;
use App\Models\Section;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile as GoogleDriveFile;
use Google\Service\Drive\Permission;
use App\Notifications\UserNotification;


class StudentClassController extends Controller
{
    public function checkTitle(Request $request)
    {
        // Validate the title parameter
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        // Check if the title already exists
        $exists = ManuscriptProject::where('man_doc_title', $request->input('title'))->exists();

        return response()->json(['exists' => $exists]);
    }

    public function storeManuscriptProject(Request $request)
    {

        $uniBranchId = $this->fetchUniBranchId();
        Log::info('Request Data:', $request->all());
        try {
            $validatedData = $request->validate([
                'group_name' => 'required|string|max:255',
                'man_doc_title' => 'required|string|max:255',
                'man_doc_description' => 'required|string',
                'man_doc_adviser' => 'required|string|max:255',
                'man_doc_author' => 'nullable|array',
                'man_doc_author.*' => '.string|max:255',
                'tags_name' => 'nullable|array', // Change this line to match your input key
                'tags_name.*' => 'string|max:255', // Validate individual tag names
                // 'man_doc_content' => 'required|file|mimes:pdf,docx|max:20480',
                'man_doc_content' => 'required|file|mimes:docx',

            ]);

            //Get the class code using request
            $section_id = $request->get('section_id');
            $section_classcode = $request->get('section_classcode');
            $task_id = $request->get('task_id');

            // Use the correct key to get tags from the request
            $tags = $request->get('tags_name', []); // Change from 'tags' to 'tags_name'

            // Use the correct key to get tags from the request
            $users = $request->get('name', []); // Change from 'tags' to 'tags_name'


            // Get the file from the request
            $file = $request->file('man_doc_content');

            // Generate a unique filename
            $fileName = time() . '_' . $file->getClientOriginalName();

            //Move the file at the last part of this process
            // Move the file to the public/storage/capstone_files directory
            // $file->move(public_path('storage/capstone_files'), $fileName);

            // Store the relative path to the file (without the 'public' part)
            $filePath = 'storage/capstone_files/' . $fileName;

            // Create the gorup
            $group =  Group::firstOrCreate([
                'group_name' => $validatedData['group_name'],
                'section_id' => $section_id,
                'task_id' => $task_id,
            ]);

            Log::info('Group ID Created:', ['id' => $group->id]);

            // Create the manuscript project
            $manuscriptProject = ManuscriptProject::create([
                'man_doc_title' => $validatedData['man_doc_title'],
                'man_doc_description' => $validatedData['man_doc_description'],
                'man_doc_adviser' => $validatedData['man_doc_adviser'],
                'man_doc_content' => $filePath, // Save the relative path to the database
                // 'class_code' => $section_classcode,
                'group_id' => $group->id, // The group ID from the saved manuscript
                'section_id' => $section_id,
                'man_doc_status' => 'P',
                'uni_branch_id' => $uniBranchId,
            ]);

            Log::info('Manuscript Project Created:', ['id' => $manuscriptProject->id]);

            // Handle tags and store them in the ManuscriptTag table
            $tagIds = []; // Array to hold the IDs of the tags to be associated with the manuscript

            if (!empty($tags) && is_array($tags)) { // Ensure $tags is an array and not empty
                foreach ($tags as $tagName) {
                    // Convert tag to lowercase for consistency and trim any whitespace
                    $tagName = strtolower(trim($tagName));

                    // Find the tag by its name
                    $tag = Tags::where('tags_name', $tagName)->first();

                    // If the tag does not exist, create a new record and get its ID
                    if (!$tag) {
                        $tag = Tags::create(['tags_name' => $tagName]);
                        Log::info("Tag '$tagName' created with ID: " . $tag->id);
                    } else {
                        Log::info("Tag '$tagName' found with ID: " . $tag->id);
                    }

                    // Store the tag ID for the ManuscriptTag table
                    $tagIds[] = $tag->id;
                }
            } else {
                Log::info('No tags provided or tags is not an array.');
            }

            // Insert the tags into the ManuscriptTag table
            foreach ($tagIds as $tagId) {
                ManuscriptTag::create([
                    'manuscript_id' => $manuscriptProject->id, // The manuscript ID from the saved manuscript
                    'tag_id' => $tagId, // The tag ID from the tags table
                ]);
                Log::info("Inserted into ManuscriptTag:", [
                    'manuscript_id' => $manuscriptProject->id,
                    'tag_id' => $tagId,
                ]);
            }



            // Handle users and store them in the Author table
            $userIds = []; // Array to hold the IDs of the users to be associated with the manuscript

            if (!empty($users) && is_array($users)) { // Ensure $users is an array and not empty
                foreach ($users as $userName) {
                    // Convert name to lowercase for consistency and trim any whitespace
                    $userName = strtolower(trim($userName));

                    // Find the users by its name
                    $user = User::where('name', $userName)->first();

                    // If the users does not exist, create a new record and get its ID
                    if (!$user) {
                        return response()->json(['message' => 'User does not exist.', 'errors'], 422);
                    } else {
                        // $author = User::create(['name' => $userName]);
                        Log::info("Author '$userName' found with ID: " . $user->id);
                        // Store the Users ID for the Authors table
                        $userIds[] = $user->id;
                    }
                }
            } else {
                Log::info('No users provided or users is not an array.');
            }
            $authorIds = [];

            // Insert the users into the author table
            foreach ($userIds as $userId) {
                Author::create([
                    'man_doc_id' => $manuscriptProject->id, // The manuscript ID from the saved manuscript
                    'user_id' => $userId, // The tag ID from the tags table
                ]);
                Log::info("Inserted into Authors Table:", [
                    'man_doc_id' => $manuscriptProject->id,
                    'user_id' => $userId,
                ]);

                $authorIds[] = $userId;
            }


            // Update users' group_id and section_id into the group members table
            foreach ($userIds as $userId) {
                // Update the group_id and section_id for each user where the section_id matches
                GroupMember::where('stud_id', $userId) // Filter by user_id
                    ->where('section_id', $section_id) // Add the filter for section_id
                    ->update([
                        'group_id' => $group->id,    // Set the new group_id
                        'task_id' => $task_id,
                    ]);

                Log::info("Updated Group Member Table:", [
                    'stud_id' => $userId,
                    'group_id' => $group->id,  // Log the updated group ID
                    'section_id' => $section_id, // Log the section ID
                    'task_id' => $task_id,
                ]);
            }



            if($manuscriptProject)
             {

                $section = Section::where('id', $section_id)->first();
                $teacherId = $section->ins_id;

                Log::info('Fetched Author Emails:', ['Autho Ids' => $authorIds]);


                // Upload the file to Google Drive and get the Google Docs URL
                $googleDocsUrl = $this->uploadToDrive($request->file('man_doc_content'), $authorIds, $teacherId, $manuscriptProject->id);

                Log::info('Google Docs Url:', ['URL: ' => $googleDocsUrl]);

                if($googleDocsUrl) {
                    $manuscriptProject->update([
                        'man_doc_content' => $googleDocsUrl,
                    ]);
                }



                $file->move(public_path('storage/capstone_files'), $fileName);

                 $faculty = $section->ins_id;

                 RevisionHistory::create([
                     'ins_comment' => "Start",
                     'man_doc_id' => $manuscriptProject->id,
                     'ins_id' => $faculty,
                     'man_doc_status' => 'P',
                     'group_id' => $group->id,
                     'section_id' =>$section_id,
                 ]);
             }

            return response()->json(['message' => 'Manuscript project uploaded successfully.'], 200);

        } catch (\Exception $e) {
            Log::error('Error uploading manuscript project:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error uploading manuscript project.', 'errors' => $e->getMessage()], 422);
        }
    }



    public function storeAuthor(Request $request)
    {
        Log::info('Request Data:', $request->all());
        try {
            $validatedData = $request->validate([
                'man_doc_id' => 'required|string|max:255',
                'man_doc_author' => 'nullable|array',
                'man_doc_author.*' => '.string|max:255',

            ]);

            // Handle users and store them in the Author table
            $userIds = []; // Array to hold the IDs of the users to be associated with the manuscript

            if (!empty($users) && is_array($users)) { // Ensure $users is an array and not empty
                foreach ($users as $userName) {
                    // Convert name to lowercase for consistency and trim any whitespace
                    $userName = strtolower(trim($userName));

                    // Find the users by its name
                    $user = User::where('name', $userName)->first();

                    // If the users does not exist, create a new record and get its ID
                    if (!$user) {
                        return response()->json(['message' => 'User does not exist.', 'errors'], 422);
                    } else {
                        // $author = User::create(['name' => $userName]);
                        Log::info("Author '$userName' found with ID: " . $user->id);
                        // Store the Users ID for the Authors table
                        $userIds[] = $user->id;
                    }
                }
            } else {
                Log::info('No users provided or users is not an array.');
            }
            $authorIds = [];

            // Insert the users into the author table
            foreach ($userIds as $userId) {
                Author::create([
                    'man_doc_id' => $ManuscriptProject->id, // The manuscript ID from the saved manuscript
                    'user_id' => $userId, // The tag ID from the tags table
                ]);
                Log::info("Inserted into Authors Table:", [
                    'man_doc_id' => $manuscriptProject->id,
                    'user_id' => $userId,
                ]);

                $authorIds[] = $userId;
            }
            return response()->json(['message' => 'Manuscript project uploaded successfully.'], 200);

        } catch (\Exception $e) {
            Log::error('Error uploading manuscript project:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error uploading manuscript project.', 'errors' => $e->getMessage()], 422);
        }
    }


    public function checkClassCode(Request $request)
    {
        // Validate the incoming request to ensure 'class_code' is provided and is a string
        $request->validate([
            'class_code' => 'required|string',
        ]);

        // Attempt to find a class in the database where the class_code matches the provided value
        $class = Section::where('section_classcode', $request->class_code)->first();

        // If a class is found, return a JSON response indicating that it exists
        if ($class) {
            return response()->json([
                'exists' => true, // Indicate that the class code exists
                'classDetails' => [ // Provide additional details about the class
                    'class_name' => $class->class_name, // The name of the class
                    'ins_id' => $class->ins_id, // The instructor ID associated with the class
                ],
            ]);
        } else {
            // If no class is found, return a JSON response indicating that it does not exist
            return response()->json(['exists' => false]);
        }
    }


    public function storeStudentClass(Request $request)
    {
        // $request->validate([
        //     'class_code' => 'required|string',
        //     'class_name' => 'required|string',
        //     'ins_id' => 'required|integer',
        // ]);

        $request->validate([
            'class_code' => 'required|string',
        ]);


        $userId = Auth::id();

        try {
            // Check if the class exists
            $section = Section::where('section_classcode', $request->class_code)->first();

            if (!$section) {
                return response()->json(['success' => false, 'message' => 'Class code not found']);
            }

            // Check if the user is already enrolled in the class
            $existingEnrollment = GroupMember::where([
                ['section_id', $section->id],
                ['stud_id', $userId],
            ])->first();

            if ($existingEnrollment) {
                // User is already enrolled
                return response()->json(['success' => true, 'message' => 'Already enrolled']);
            } else {
                // Insert the new enrollment
                GroupMember::create([
                    'section_id' => $section->id, // Use the class ID from Section
                    'stud_id' => $userId, // Store the user ID
                ]);


                 // Notifies the teacher that a new student joins
                 $teacher = User::find($section->ins_id);
                 $newStudent = Auth::user()->name;

                 if ($teacher) {
                         $teacher->notify(new UserNotification([
                             'message' => $newStudent . ' joins ' . $section->section_name,
                             'user_id' => $teacher->id
                         ]));
                 }

                return response()->json([
                    'success' => true,
                    'message' => 'Joined class successfully',
                    'classId' => $section->id
                ]);
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



//get ratings
// SELECT
//     manuscript_id,
//     ROUND(SUM(user_total_ratings) / COUNT(DISTINCT user_id), 2) AS average_total_rating,
//     ROUND((SUM(user_total_ratings) / COUNT(DISTINCT user_id)) * 5, 2) AS final_rating
// FROM (
//     SELECT
//         manuscript_id,
//         user_id,
//         SUM(rating) / 5 AS user_total_ratings
//     FROM
//         ratings
//     GROUP BY
//         manuscript_id, user_id
// ) AS user_ratings
// GROUP BY
//     manuscript_id
// ORDER BY
//     final_rating DESC;

// public function getPublishedManuscripts()
// {
//     try {
//         // Fetch manuscripts with 'Y' status, associated tags, and authors
//         $manuscripts = ManuscriptProject::with(['tags', 'authors']) // Eager load both tags and authors relationships
//             ->where('is_publish', '1')
//             ->get();

//         // Log the fetched manuscripts for debugging
//         logger()->info('Fetched Manuscripts with Tags and Authors:', $manuscripts->toArray());

//         return response()->json($manuscripts, 200);
//     } catch (\Exception $e) {
//         return response()->json(['message' => 'Error fetching manuscripts.', 'errors' => $e->getMessage()], 500);
//     }
// }

//recommended ratings
// SELECT
//     m.id,
//     m.man_doc_title,
//     m.man_doc_content,
//     m.man_doc_description,
//     m.man_doc_status,
//     m.man_doc_adviser,
//     m.man_doc_view_count,
//     m.is_publish,
//     m.created_at,
//     m.updated_at,
//     m.class_code,
//     ROUND(SUM(r.rating / 5) / COUNT(DISTINCT r.user_id), 2) AS average_total_rating, -- Divides each user's rating by 5 before summing
//     ROUND((SUM(r.rating / 5) / COUNT(DISTINCT r.user_id)) * 5, 2) AS final_rating -- Final rating scaled to 5
// FROM
//     manuscripts AS m
// INNER JOIN
//     ratings AS r ON m.id = r.manuscript_id
// GROUP BY
//     m.id
// HAVING
//     COUNT(DISTINCT r.user_id) > 0 -- Ensure there are ratings before calculating
// ORDER BY
//     final_rating DESC;

// public function getPublishedManuscripts(Request $request)
// {
//     try {
//         //Retrieve the 'choice' query parameter
//         $keyword = $request->query('keyword');
//         Log::info('My keyword: ' . $keyword);
//         // Determine relationships to load based on choice

//             $manuscripts = ManuscriptProject::with(['tags', 'authors']) // Exclude ratings if choice is 'R' or any other value
//                 ->where('is_publish', '1')
//                 ->get();


//         // Log the fetched manuscripts for debugging
//         logger()->info('Fetched Manuscripts with Tags and Authors:', $manuscripts->toArray());

//         return response()->json($manuscripts, 200);
//     } catch (\Exception $e) {
//         return response()->json(['message' => 'Error fetching manuscripts.', 'errors' => $e->getMessage()], 500);
//     }
// }


public function getPublishedManuscripts(Request $request)
{
    try {
        // Retrieve the 'keyword' and 'searchField' query parameters
        $keyword = $request->query('keyword');
        $searchField = $request->query('searchField', 'Title'); // Default to Title if not specified
        Log::info('My keyword: ' . $keyword);
        Log::info('Search field: ' . $searchField);

        // Optionally, you can check if the user is authenticated
        if (auth()->check()) {
            // If the user is authenticated, you can perform specific actions
            $user = auth()->user();
            Log::info('Authenticated user:', ['user' => $user]);
        } else {
            // If the user is not authenticated, you can handle the behavior accordingly
            Log::info('Unauthenticated user accessed the manuscripts.');
        }

        // Initialize manuscripts query
        $manuscripts = ManuscriptProject::with(['tags', 'authors'])
            ->where('is_publish', '1')
            ->where('man_doc_visibility', 'Y');

        // Filter manuscripts based on the selected search field
        if ($keyword) {
            if ($searchField === 'Title') {

                $manuscripts = $manuscripts
                ->where('man_doc_visibility', '=', 'Y')
                ->where('man_doc_title', 'like', '%' . $keyword . '%');

            } elseif ($searchField === 'Tags') {
                $manuscripts = $manuscripts->whereHas('tags', function ($query) use ($keyword) {
                    $query->where('tags_name', 'like', '%' . $keyword . '%');
                });
            } elseif ($searchField === 'Authors') {
                $manuscripts = $manuscripts->whereHas('authors', function ($query) use ($keyword) {
                    $query->where('name', 'like', '%' . $keyword . '%');
                });
            }
        }

        // Execute the query to get the results
        $fetchedManuscripts = $manuscripts->get();

        Log::info('Published Manuscripts:', ['manuscripts' => $fetchedManuscripts]);

        // Log the number of manuscripts found
        if ($fetchedManuscripts->isNotEmpty()) {
            Log::info('Found manuscripts:', $fetchedManuscripts->toArray());
        } else {
            Log::info('No manuscripts found for the given keyword and search field.');
        }

        return response()->json($fetchedManuscripts, 200);
    } catch (\Exception $e) {
        // Log the error details for debugging
        Log::error('Error fetching manuscripts: ' . $e->getMessage(), [
            'stack' => $e->getTraceAsString()
        ]);

        return response()->json(['message' => 'Error fetching manuscripts.', 'errors' => $e->getMessage()], 500);
    }
}




public function getPublishedRecManuscripts(Request $request)
{
    try {
        //Retrieve the 'choice' query parameter
        $choice = $request->query('choice');
        Log::info('My choice: ' . $choice);
        // Determine relationships to load based on choice

            $manuscripts = ManuscriptProject::with(['ratings', 'authors', 'tags'])
            ->select('manuscripts.id', 'manuscripts.man_doc_title', 'manuscripts.man_doc_description', 'manuscripts.man_doc_content',
                     'manuscripts.man_doc_adviser', 'manuscripts.man_doc_view_count',
                     'manuscripts.is_publish', DB::raw('SUM(ratings.rating) as total_rating'),
                     DB::raw('COUNT(ratings.id) as rating_count'))
            ->join('ratings', 'manuscripts.id', '=', 'ratings.manuscript_id')
            ->leftJoin('author', 'manuscripts.id', '=', 'author.man_doc_id')
            ->leftJoin('manuscript_tag', 'manuscripts.id', '=', 'manuscript_tag.manuscript_id')
            ->leftJoin('tags', 'manuscript_tag.tag_id', '=', 'tags.id')
            ->where('manuscripts.is_publish', '1') // Inserted here
            ->where('manuscripts.man_doc_visibility', 'Y') // Inserted here
            ->groupBy('manuscripts.id', 'manuscripts.man_doc_title', 'manuscripts.man_doc_description', 'manuscripts.man_doc_content',
                      'manuscripts.man_doc_adviser', 'manuscripts.man_doc_view_count',
                      'manuscripts.is_publish')
            ->havingRaw('COUNT(ratings.id) > 0 AND (SUM(ratings.rating) / COUNT(ratings.id)) >= 3')
            ->orderBy(DB::raw('SUM(ratings.rating) / COUNT(ratings.id)'), 'DESC')
            ->get();
        // Log the fetched manuscripts for debugging
        logger()->info('Fetched Manuscripts with Tags and Authors:', $manuscripts->toArray());

        return response()->json($manuscripts, 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error fetching manuscripts.', 'errors' => $e->getMessage()], 500);
    }
}



public function getMyUniBooks(Request $request)
{
    try {
        // Fetch Uni Branch ID
        $uniBranchId = $this->fetchUniBranchId();
        Log::info('Uni Branch Id: ', ['uniBranchId' => $uniBranchId]);  // Updated to pass array

        // Retrieve the 'keyword' and 'searchField' query parameters
        $keyword = $request->query('keyword');
        $searchField = $request->query('searchField', 'Title'); // Default to Title if not specified
        Log::info('My keyword: ', ['keyword' => $keyword]);  // Updated to pass array
        Log::info('Search field: ', ['searchField' => $searchField]);  // Updated to pass array

        // Optionally, you can check if the user is authenticated
        if (auth()->check()) {
            // If the user is authenticated, you can perform specific actions
            $user = auth()->user();
            Log::info('Authenticated user:', ['user' => $user]);
        } else {
            // If the user is not authenticated, you can handle the behavior accordingly
            Log::info('Unauthenticated user accessed the manuscripts.');
        }

        // Initialize manuscripts query
        $manuscripts = ManuscriptProject::with(['tags', 'authors'])
            ->where('is_publish', '1')
            ->where('uni_branch_id', $uniBranchId);

        // Filter manuscripts based on the selected search field
        if ($keyword) {
            if ($searchField === 'Title') {
                $manuscripts = $manuscripts->where('man_doc_title', 'like', '%' . $keyword . '%');
            } elseif ($searchField === 'Tags') {
                $manuscripts = $manuscripts->whereHas('tags', function ($query) use ($keyword) {
                    $query->where('tags_name', 'like', '%' . $keyword . '%');
                });
            } elseif ($searchField === 'Authors') {
                $manuscripts = $manuscripts->whereHas('authors', function ($query) use ($keyword) {
                    $query->where('name', 'like', '%' . $keyword . '%');
                });
            }
        }

        // Execute the query to get the results
        $fetchedManuscripts = $manuscripts->get();

        Log::info('Published Manuscripts:', ['manuscripts' => $fetchedManuscripts]);

        // Log the number of manuscripts found
        if ($fetchedManuscripts->isNotEmpty()) {
            Log::info('Found manuscripts:', ['manuscripts' => $fetchedManuscripts->toArray()]);
        } else {
            Log::info('No manuscripts found for the given keyword and search field.');
        }

        return response()->json($fetchedManuscripts, 200);
    } catch (\Exception $e) {
        // Log the error details for debugging
        Log::error('Error fetching manuscripts: ' . $e->getMessage(), [
            'stack' => $e->getTraceAsString()
        ]);

        return response()->json(['message' => 'Error fetching manuscripts.', 'errors' => $e->getMessage()], 500);
    }
}



    // /**
    // public function fetchUniBranchId()
    // {
    //     // Get the authenticated user's ID
    //     $userId = Auth::id();

    //     // Find the student record where user_id matches Auth::id()
    //     $student = Student::where('user_id', $userId)->first();

    //     // Log the student's details
    //     Log::info('Users uni branch ID:', $student ? $student->toArray() : []);
    //     Log::info('Users uni branch ID:', ['uni_branch_id' => $student?->uni_branch_id]);


    //     // Return the uni_branch_id if a student record exists
    //     return $student ? $student->uni_branch_id : null;
    // }




    public function fetchUniBranchId()
    {
        // Get the authenticated user's ID
        $userId = Auth::id();

        // Find the user record by user_id (this can be a student, teacher, or null)
        $user = User::where('id', $userId)->first(); // Assuming 'id' is the correct column

        // Log the user's details
        Log::info('User Details:', $user ? $user->toArray() : []);

        // Check if user record exists and handle based on user type (student, teacher, or null)
        if ($user) {
            // Log the user_type value from the user record
            Log::info('User Type:', ['user_type' => $user->user_type]);

            // Check if the user is a student or teacher based on the 'user_type' column
            if ($user->user_type === 'student') {
                // Find the student record where user_id matches Auth::id()
                $student = Student::where('user_id', $userId)->first();

                // Log the fetched student record
                Log::info('Student Details:', $student ? $student->toArray() : []);

                // If the user is a student, return their associated uni_branch_id
                return $student ? $student->uni_branch_id : null;
            } elseif ($user->user_type === 'teacher') {
                // If the user is a teacher, you might want to return something else or null
                $faculty = Faculty::where('user_id', $userId)->first();

                // Log the fetched faculty record
                Log::info('Faculty Details:', $faculty ? $faculty->toArray() : []);

                return $faculty ? $faculty->uni_branch_id : null;  // Or any other value specific to the teacher type
            }
        }

        // If no user record or undefined user_type, log the situation and return null
        Log::info('No user found or undefined user_type, returning null.');
        return null;
    }




// SELECT *
// FROM manuscripts mp
// JOIN author a ON mp.id = a.man_doc_id
// WHERE mp.man_doc_status = 'Y'
// AND a.user_id = 31
// LIMIT 0, 25;

public function myApprovedManuscripts()
{
    $userId = Auth::id(); // Get the ID of the currently signed-in user

    // Log the user ID to track which user is making the request
    Log::info("User {$userId} is fetching approved manuscripts.");

    try {
        // Fetch approved manuscripts for the currently authenticated user, including tags and authors
        $manuscripts = ManuscriptProject::with(['tags', 'authors']) // Eager load tags and authors relationships
            ->join('author', 'manuscripts.id', '=', 'author.man_doc_id')
            ->where('manuscripts.man_doc_status', 'A') // Ensure only approved manuscripts are retrieved
            ->where('author.user_id', $userId) // Filter by the current user
            ->select('manuscripts.*') // Select fields from manuscripts table
            ->get();

        // Log the manuscripts data (you can log only the specific data you need for debugging, like IDs or titles)
        Log::info('Fetched approved manuscripts for user ' . $userId, ['manuscripts' => $manuscripts]);

        return response()->json($manuscripts, 200);
    } catch (\Exception $e) {
        // Log any errors that occur during the process
        Log::error("Error fetching approved manuscripts for user {$userId}: " . $e->getMessage());

        return response()->json(['error' => 'An error occurred while fetching the manuscripts.'], 500);
    }
}



public function teachersRepository()
{
    $userId = Auth::id(); // Get the ID of the currently signed-in user

    // Log the user ID to track which user is making the request
    Log::info("User {$userId} is fetching approved manuscripts.");

    try {
        // Fetch approved manuscripts for the currently authenticated user, including tags and authors
        // $manuscripts = ManuscriptProject::with(['tags', 'authors', 'section.faculty']) // Eager load tags and authors relationships
        //     ->join('author', 'manuscripts.id', '=', 'author.man_doc_id')
        //     ->where('manuscripts.man_doc_status', 'A') // Ensure only approved manuscripts are retrieved
        //     ->where('section.faculty.id', $userId) // Filter by the current user
        //     ->select('manuscripts.*') // Select fields from manuscripts table
        //     ->get();


        $manuscripts = ManuscriptProject::with(['tags', 'authors', 'section.user'])  // Eager load related models
        ->where('manuscripts.man_doc_status', 'A') // Only approved manuscripts
        ->whereHas('section.user', function($query) use ($userId) {
            $query->where('id', $userId);  // Filter by the faculty's ID
        })  // Select only manuscript fields
        ->get();



        // Log the manuscripts data (you can log only the specific data you need for debugging, like IDs or titles)
        Log::info('Fetched approved manuscripts for user ' . $userId, ['manuscripts' => $manuscripts->toArray()]);

        return response()->json($manuscripts, 200);
    } catch (\Exception $e) {
        // Log any errors that occur during the process
        Log::error("Error fetching approved manuscripts for user {$userId}: " . $e->getMessage());

        return response()->json(['error' => 'An error occurred while fetching the manuscripts.'], 500);
    }
}

public function myfavoriteManuscripts()
{
    $userId = Auth::id(); // Get the ID of the currently signed-in user
    Log::info("User {$userId} is fetching favorite manuscripts.");

    // Fetch approved manuscripts for the currently authenticated user, including tags and authors
    try {
        $manuscripts = ManuscriptProject::with(['tags', 'authors']) // Eager load tags and authors relationships
            ->join('favorites', 'manuscripts.id', '=', 'favorites.man_doc_id')
            ->where('favorites.user_id', $userId) // Filter by the current user
            ->select('manuscripts.*') // Select fields from manuscripts table
            ->get();

        Log::info("Successfully retrieved favorite manuscripts for user {$userId}.");

        return response()->json($manuscripts, 200);

        Log::info("Successfully retrieved favorite manuscripts for user {$manuscripts}.");
    } catch (\Exception $e) {
        Log::error("Error fetching favorite manuscripts for user {$userId}: " . $e->getMessage());

        return response()->json(['error' => 'An error occurred while fetching the manuscripts.'], 500);
    }
}


    // public function storefavorites(Request $request)
    // {
    //     // Check if the user is authenticated
    //     if (!Auth::check()) {
    //         return response()->json(['message' => 'You need to be logged in to bookmark'], 401);
    //     }

    //     $user = Auth::user();
    //     $manuscriptId = $request->input('man_doc_id');

    //     // Check if the manuscript is already bookmarked
    //     $alreadyBookmarked = Favorite::where('man_doc_id', $manuscriptId)
    //         ->where('user_id', $user->id)
    //         ->exists();

    //     if ($alreadyBookmarked) {
    //         return response()->json(['message' => 'Already bookmarked'], 200);
    //     }

    //     // Create the new bookmark
    //     $favorite = new Favorite();
    //     $favorite->man_doc_id = $manuscriptId;
    //     $favorite->user_id = $user->id;
    //     $favorite->save();

    //     return response()->json(['message' => 'Manuscript bookmarked successfully!'], 201);
    // }


   // Get the favorites of a user by ID
   public function getUserFavorites($id) {
    Log::info('Fetching favorites for user ID: ' . $id);
    $favorites = Favorite::where('user_id', $id)->get();

    Log::info('Favorites retrieved: ', $favorites->toArray()); // Log retrieved favorites

    if ($favorites->isEmpty()) {
        return response()->json([], 204); // No content
    }

    return response()->json($favorites);
}




    public function storefavorites(Request $request)
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'You need to be logged in to bookmark'], 401);
        }

        // Validate input data
        $request->validate([
            'man_doc_id' => 'required|integer|exists:manuscripts,id',  // Assuming 'manuscripts' is your table
        ]);

        $user = Auth::user();
        $manuscriptId = $request->input('man_doc_id');

        // Check if the manuscript is already bookmarked
        $alreadyBookmarked = Favorite::where('man_doc_id', $manuscriptId)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyBookmarked) {
            return response()->json(['message' => 'Already bookmarked'], 200);
        }

        // Create the new bookmark
        $favorite = new Favorite();
        $favorite->man_doc_id = $manuscriptId;
        $favorite->user_id = $user->id;
        $favorite->save();

        return response()->json(['message' => 'Manuscript bookmarked successfully!'], 201);
    }


    public function removeFavorite(Request $request)
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'You need to be logged in to remove a bookmark'], 401);
        }

        $user = Auth::user();
        $manuscriptId = $request->input('man_doc_id');

        // Find the favorite record
        $favorite = Favorite::where('man_doc_id', $manuscriptId)
            ->where('user_id', $user->id)
            ->first();

        // Check if the manuscript is bookmarked
        if (!$favorite) {
            return response()->json(['message' => 'Bookmark not found'], 404);
        }

        // Delete the favorite record
        $favorite->delete();

        return response()->json(['message' => 'Manuscript removed from bookmarks successfully!'], 200);
    }



    /**
     * Download the manuscript PDF.
     *
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */


    //  public function downloadPdf($id)
    //  {
    //      $manuscript = ManuscriptProject::findOrFail($id);
    //      $filename = $manuscript->man_doc_content; // e.g., storage/capstone_files/{filename}

    //      // Resolve the correct file path
    //      $filePath = public_path(str_replace('storage/', '', $filename));

    //      // Debugging: Log the file paths
    //      Log::info('Filename from DB: ' . $filename);
    //      Log::info('Resolved file path: ' . $filePath);

    //      // Check if the file exists
    //      if (!file_exists($filePath)) {
    //          Log::error('File not found at: ' . $filePath);
    //          abort(404, 'File not found.');
    //      }

    //      $originalName = basename($filename);

    //      return response()->download($filePath, $originalName, [
    //          'Content-Type' => 'application/pdf',
    //      ]);
    //  }



    public function downloadPdf($manuscriptId)
{
    // Fetch the manuscript record from the database
    $manuscript = ManuscriptProject::findOrFail($manuscriptId);

    // Construct the full path to the file
    $filePath = public_path($manuscript->man_doc_content); // Assuming `file_path` is the DB column

    // Check if the file exists
    if (!file_exists($filePath)) {
        abort(404, 'File not found.');
    }

    // Return the file as a download
    return response()->download($filePath, basename($filePath));
}



  /**
     * Check if the authenticated user is part of a group.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkGroup(Request $request)
    {
        Log::info('hi');

        $section_id = $request->get('section_id');
        $task_id = $request->get('task_id');

        Log::info($section_id);

        Log::info('this is the task ID:', ['task_id' => $task_id]);

        // Get the authenticated user's ID
        $userId = Auth::id();

        // Check if the user has a non-null group_id
        $hasGroup = GroupMember::where('stud_id', $userId)
            ->where('task_id', $task_id)
            ->where('section_id', $section_id)
            ->whereNotNull('group_id')
            ->exists();

    // Log information about whether the user has a group
    Log::info("This user has a group already", ['hasGroup' => $hasGroup]);
        // Return the result as a JSON response
        return response()->json([
            'hasGroup' => $hasGroup,
        ]);
    }


public function checkStudentInClass()
{

     // Load user with manuscripts that are not approved, including tags and revision history
     $user = Auth::user()->load([
        'manuscripts' => function ($query) {
            $query->where('man_doc_status', 'P');
        },
        'manuscripts.tags',
        'manuscripts.revision_history.faculty',
        'manuscripts.authors'
    ]);

    Log::info($user->manuscripts);

    // Check if the user is enrolled in any class
    if($user->user_type === 'student') {
        $userClass = ClassStudent::where('stud_id', $user->id)->first();
        $class = ClassModel::where('id', $userClass->class_id)->first();
    } else {
        $userClass = ClassModel::where('ins_id', $user->id)->first();
        $class = ClassModel::where('id', $userClass->id)->first();
    }

    if ($userClass) {
        return response()->json([
            'class' => $userClass,
            'classCode' => $class->class_code,
            'manuscripts' => $user->manuscripts
        ]);
    } else {
        return response()->json();
    }
}



public function storeRatings(Request $request)
{
    Log::info('Incoming request: ', $request->all());

    try {
                // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['error' => 'To submit a rating, please log in.'], 401);
        }
        // Log request data before validation
        Log::info('Request data: ', $request->all());

        // Validate the request
        $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'rating' => 'required|integer|between:1,5',
        ]);

        // Log user ID for debugging
        $userId = Auth::id();
        Log::info('User ID: ' . $userId);

        // Check if the user has already rated this manuscript
        $existingRating = Rating::where([
            'user_id' => $userId,
            'manuscript_id' => $request->manuscript_id,
        ])->first();

        if ($existingRating) {
            return response()->json(['message' => 'You have already rated this manuscript.'], 409);
        }

        // Log data to be used in the updateOrCreate
        Log::info('Creating rating with data:', [
            'user_id' => $userId,
            'manuscript_id' => $request->manuscript_id,
            'rating' => $request->rating,
        ]);
        Log::info('Creating rating with data:', [
            'user_id' => $userId,
            'manuscript_id' => $request->manuscript_id,
            'rating' => $request->rating,
        ]);

        // Create the new rating
        $rating = Rating::create([
            'user_id' => $userId,
            'manuscript_id' => $request->manuscript_id,
            'rating' => $request->rating,
        ]);

        return response()->json(['message' => 'Rating submitted successfully!', 'rating' => $rating], 201);
    } catch (\Exception $e) {
        Log::error('Error submitting rating', [
            'exception' => $e->getMessage(),
            'stack' => $e->getTraceAsString(),
            'request' => $request->all(),
        ]);
        return response()->json(['error' => 'Failed to submit rating: ' . $e->getMessage()], 500);
    }

}



public function view($filename)
{
    Log::info('View method called for filename: ' . $filename);
    $filePath = public_path('/storage/capstone_files/' . $filename);

    Log::info('Checking file path: ' . $filePath);

    if (!file_exists($filePath)) {
        Log::error('File not found: ' . $filename);
        abort(404, 'File not found');
    }

    Log::info('File found: ' . $filename);
    return view('view_file', compact('filename'));
}


public function isPremium()
{
    // Ensure the user is authenticated
    $user = Auth::user();

    // If user is not authenticated, return an error response
    if (!$user) {
        return response()->json([
            'is_premium' => false,
            'is_authenticated' => false,  // Add an is_authenticated field for easier front-end check
            'message' => 'User is not authenticated.',
        ], 401); // Unauthorized
    }

    // Check if the user is premium
    if ($user->is_premium == 1) {
        return response()->json([
            'is_premium' => true,
            'is_authenticated' => true, // User is authenticated and premium
            'message' => 'User is a premium member.',
        ]);
    } else {
        return response()->json([
            'is_premium' => false,
            'is_authenticated' => true, // User is authenticated but not premium
            'message' => 'User is not a premium member.',
        ]);
    }
}



// public function isPremium()
// {
//     // Ensure the user is authenticated
//     $user = Auth::user();

//     // If user is not authenticated or not premium, return false with a message
//     if (!$user || $user->is_premium != 1) {
//         return response()->json([
//             'is_premium' => false,
//             'message' => 'User is either not authenticated or not a premium member.',
//         ]);
//     }

//     // If user is authenticated and premium, return true with a message
//     return response()->json([
//         'is_premium' => true,
//         'message' => 'User is a premium member.',
//     ]);
// }


    public function uploadToDrive($file, $authorIds, $teacherId, $manuscriptId)
    {

        Log::info('Start Google Drive Upload Process');

        $keyFilePath = storage_path('app/document-management-438910-d2725c4da7e7.json');

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setAuthConfig($keyFilePath);
        // $client->setAuthConfig([
        //     'type' => env('GOOGLE_SERVICE_TYPE'),
        //     'project_id' => env('GOOGLE_SERVICE_PROJECT_ID'),
        //     'private_key_id' => env('GOOGLE_SERVICE_PRIVATE_KEY_ID'),
        //     'private_key' => env('GOOGLE_SERVICE_PRIVATE_KEY'),
        //     'client_email' => env('GOOGLE_SERVICE_CLIENT_EMAIL'),
        //     'client_id' => env('GOOGLE_SERVICE_CLIENT_ID'),
        //     'auth_uri' => env('GOOGLE_SERVICE_AUTH_URI'),
        //     'token_uri' => env('GOOGLE_SERVICE_TOKEN_URI'),
        //     'auth_provider_x509_cert_url' => env('GOOGLE_SERVICE_AUTH_PROVIDER_CERT_URL'),
        //     'client_x509_cert_url' => env('GOOGLE_SERVICE_CLIENT_CERT_URL'),
        // ]);
        $client->addScope(GoogleDrive::DRIVE_FILE);


    // Initialize Google Drive Service
    $driveService = new GoogleDrive($client);

        // Upload the file to Google Drive
        $driveFile = new GoogleDriveFile();
        $driveFile->setName($file->getClientOriginalName());
        $driveFile->setMimeType('application/vnd.google-apps.document');

        // Convert the file to google docs format
        $uploadOptions = [
            'data' => file_get_contents($file->getRealPath()),
            'mimeType' => 'application/vnd.google-apps.document',
            'uploadType' => 'multipart',
            'fields' => 'id'
        ];

    try {
         //Create the document in the google drive file
        $uploadedFile = $driveService->files->create($driveFile, $uploadOptions);

        //Set permissions for users
        $this->setPermissions($driveService, $uploadedFile->id, $authorIds, $teacherId, $manuscriptId);

        return 'https://docs.google.com/document/d/' . $uploadedFile->id;

    } catch (Exception $e) {
        Log::error('Error uploading file to Google Drive: ' . $e->getMessage());
        return response()->json(['error' => 'Error uploading file: ' . $e->getMessage()], 500);
    }
}


public function updateProject(Request $request, $id)
{
    // Validate incoming data
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'adviser' => 'required|string|max:255',
    ]);

    // Find the project by ID
    $project = ManuscriptProject::find($id);

    if (!$project) {
        return response()->json(['message' => 'Project not found'], 404);
    }

    // Update the project with new data
    $project->update([
        'man_doc_title' => $request->input('title'),
        'man_doc_description' => $request->input('description'),
        'man_doc_adviser' => $request->input('adviser'),
    ]);

    // Return success response
    return response()->json(['message' => 'Project updated successfully', 'data' => $project]);
}


private function setPermissions($driveService, $fileId, $authorIds, $teacherId, $manuscriptId)
{
    Log::info('Drive Service Instance:', ['driveService' => $driveService]);
    Log::info('File ID:', ['fileId' => $fileId]);
    Log::info('Teacher ID:', ['teacherId' => $teacherId]);

    // Get author emails from the Author table
    $authorEmails = User::whereIn('id', $authorIds)->pluck('email')->toArray();

    //$authorEmails = User::whereIn('user_id', $authorIds)->pluck('email')->toArray();
    Log::info('Fetched Author Emails:', ['authorEmails' => $authorEmails]);

    // Retrieve the teacher's email
    $teacherEmail = User::find($teacherId)->email;
    Log::info('Teacher Email:', ['teacherEmail' => $teacherEmail]);

    // Combine author emails and teacher email
    $emails = array_merge($authorEmails, [$teacherEmail]);
    Log::info('Combined Emails:', ['emails' => $emails]);

    // Set permissions for each user
    foreach ($emails as $email) {
        Log::info('Processing Email:', ['email' => $email]);
        // Check if the email is valid
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Log::warning('Invalid Email Address:', ['email' => $email]);
            continue;
        }

        // Create permission for the user
        $permission = new Permission();
        $permission->setType('user');
        $permission->setRole('writer');
        $permission->setEmailAddress($email);

        Log::info('Permission Object Created:', [
            'type' => $permission->getType(),
            'role' => $permission->getRole(),
            'emailAddress' => $permission->getEmailAddress(),
        ]);

        try {
            $authorId = User::where('email', $email)->pluck('id')->first();
            Log::info('Fetched This User:', ['User Id' => $authorId]);

            // Log::info('Fetched This Author:', ['Author Id' => $fetchAuthor]);

            // Set the permission
            $createdPermission = $driveService->permissions->create(
                $fileId,
                $permission,
                ['sendNotificationEmail' => false]
            );

            // Log the response after creating the permission
            Log::info('Created Permission Response:', [
                'id' => $createdPermission->getId(),
                'email' => $createdPermission->getEmailAddress(),
                'role' => $createdPermission->getRole(),
            ]);

            Log::info('Fetched This Perm Id:', ['Perm Id' => $createdPermission->getId()]);


            $fetchAuthor = Author::where('user_id', $authorId)
                    ->where('man_doc_id', $manuscriptId);

            if ($fetchAuthor) {
                $fetchAuthor->update([
                    'permission_id' => $createdPermission->getId()
                ]);
            }


        } catch (Exception $e) {
            Log::error('Error Setting Permissions:', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);
        }

    }

    return;
}

public function sendForRevision(Request $request)
{
    $manuscriptId = $request->get('manuscript_id');
    Log::info("Starting 'sendForRevision' process for manuscript ID: $manuscriptId");

    // Find the manuscript
    $manuscript = ManuscriptProject::find($manuscriptId);

    if (!$manuscript || empty($manuscript->man_doc_adviser)) {
        Log::warning("Manuscript not found or invalid data. Manuscript ID: $manuscriptId");
        return response()->json(['error' => 'Manuscript not found or invalid data.'], 404);
    }

    $manuscript->update(['man_doc_status' => 'To Review']);
    $googleDocUrl = $manuscript->man_doc_content;
    $googleDocId = $this->extractGoogleDocId($googleDocUrl);

        if (!$googleDocId) {
            Log::warning("Invalid Google Doc URL for manuscript ID: $manuscriptId");
            return response()->json(['error' => 'Invalid Google Doc URL.'], 400);
        }

        $keyFilePath = storage_path('app/document-management-438910-d2725c4da7e7.json');

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setAuthConfig($keyFilePath);
        $client->addScope(GoogleDrive::DRIVE_FILE);
        $client->setSubject('file-manager@document-management-438910.iam.gserviceaccount.com');

    $driveService = new GoogleDrive($client);


        $authors = Author::with('user')->where('man_doc_id', $manuscriptId)->get();
        // $emails = $authors->pluck('user.email')->toArray();

    foreach ($authors as $author) {
        $email = $author->user->email;
        $permId = $author->permission_id;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Log::warning('Invalid Email Address:', ['email' => $email]);
            continue;
        }


        try {
            // Fetch existing permissions
            $permissions = $driveService->permissions->listPermissions($googleDocId);
            Log::info("Existing Permissions: ", ['permissions' => $permissions]);

            $permissionFound = false;

            // Delete the existing permission if found
            foreach ($permissions as $permission) {
                if ($permission->getId() === $permId) {
                    $driveService->permissions->delete($googleDocId, $permission->getId());
                    Log::info("Deleted existing permission for: $email");
                    Log::info("Permission Id:", ['permissions' => $permission->getId()]);
                    Log::info("Permission Id in Author Table:", ['permissions' => $permId]);

                    $permissionFound = true;
                    break;
                }
            }

            // Create a new permission for the user
            $newPermission = new Permission();
            $newPermission->setType('user');
            $newPermission->setRole('reader');
            $newPermission->setEmailAddress($email);
            $driveService->permissions->create($googleDocId, $newPermission, ['sendNotificationEmail' => false]);
            Log::info("Created new 'reader' permission for: $email");

            // If no permission found, log the error
            if (!$permissionFound) {
                Log::warning("Permission not found for: $email. Skipping permission creation.");
            }

        } catch (Exception $e) {
            Log::error("Error deleting/creating permission for: $email", ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error setting permission: ' . $e->getMessage()], 500);
        }
    }

        $teacherId = Section::where('id', $manuscript->section_id)->value('ins_id');

        if ($teacherId) {
            $user = User::find($teacherId);

            if ($user) {
                $user->notify(new UserNotification([
                    'message' => "A manuscript titled '{$manuscript->man_doc_title}' is ready for review",
                    'user_id' => $user->id
                ]));
            } else {
                Log::warning("User not found for teacher ID: {$teacherId}");
            }
        } else {
            Log::warning("Teacher ID not found for section ID: {$manuscript->section_id}");
        }

        RevisionHistory::create([
            'ins_comment' => null,
            'man_doc_id' => $manuscript->id,
            'ins_id' => $teacherId,
            'man_doc_status' => 'T',
            'group_id' => $manuscript->group_id,
            'section_id' =>$manuscript->section_id,
        ]);

        return response()->json(['success' => 'Document updated successfully.']);
    }


    // Method to extract Google Doc ID from the URL
    private function extractGoogleDocId($url)
    {
        // Remove the base URL portion
        $baseUrl = "https://docs.google.com/document/d/";

        // Check if the URL starts with the expected base URL
        if (strpos($url, $baseUrl) === 0) {
            // Remove the base URL and return the remaining part of the URL as the document ID
            return substr($url, strlen($baseUrl));
        }

        return null;
    }


    //     /**
    //  * Increment manuscript view count if not already viewed in the session.
    //  *
    //  * @param int $id
    //  * @param Request $request
    //  * @return \Illuminate\Http\JsonResponse
    //  */
    // public function incrementViewCount($id, Request $request)
    // {
    //     // Retrieve the session key for viewed manuscripts
    //     $viewedManuscripts = $request->session()->get('viewed_manuscripts', []);

    //     // Check if the manuscript ID is already in the session
    //     if (!in_array($id, $viewedManuscripts)) {
    //         // Add the manuscript ID to the session
    //         $viewedManuscripts[] = $id;
    //         $request->session()->put('viewed_manuscripts', $viewedManuscripts);

    //         // Increment the view count in the database
    //         $manuscript = ManuscriptProject::findOrFail($id);
    //         $manuscript->increment('man_doc_view_count');
    //     }

    //     return response()->json(['success' => true, 'message' => 'View count updated.']);
    // }




    // public function incrementViewCount(Request $request, $manuscriptId)
    // {
    //     // Retrieve the current session ID (this is automatically available via Laravel's session handling)
    //     $sessionId = Session::getId();

    //     // Retrieve the session payload for this session
    //     $session = DB::table('sessions')->where('id', $sessionId)->first();

    //     if (!$session) {
    //         return response()->json(['message' => 'Session not found.'], 404);
    //     }

    //     try {
    //         // Attempt to unserialize the session payload
    //         $payload = @unserialize($session->payload);

    //         // Check for errors during unserialization
    //         if ($payload === false && $session->payload !== 'b:0;') {
    //             // If unserialization fails, initialize an empty payload
    //             $payload = ['viewed_manuscripts' => []];
    //         }

    //         // Initialize the viewed_manuscripts array if it doesn't exist
    //         if (!isset($payload['viewed_manuscripts'])) {
    //             $payload['viewed_manuscripts'] = [];
    //         }

    //         // Check if the manuscript has already been viewed in this session
    //         if (!in_array($manuscriptId, $payload['viewed_manuscripts'])) {
    //             // Increment the manuscript's view count in the database
    //             $manuscript = ManuscriptProject::find($manuscriptId);
    //             if ($manuscript) {
    //                 $manuscript->increment('man_doc_view_count');
    //             } else {
    //                 return response()->json(['message' => 'Manuscript not found.'], 404);
    //             }

    //             // Add the manuscript ID to the viewed list
    //             $payload['viewed_manuscripts'][] = $manuscriptId;

    //             // Update the session payload with the new data
    //             DB::table('sessions')->where('id', $sessionId)->update([
    //                 'payload' => serialize($payload),
    //             ]);

    //             return response()->json(['message' => 'View count incremented.']);
    //         } else {
    //             return response()->json(['message' => 'You have already viewed this manuscript.']);
    //         }
    //     } catch (\Exception $e) {
    //         // Handle any errors during unserialization or database interaction
    //         return response()->json(['message' => 'Error processing request.', 'error' => $e->getMessage()], 500);
    //     }
    // }

    public function incrementViewCount($manuscriptId)
{
    // Check if the manuscript has already been viewed in this session
    if (session()->has('viewed_manuscripts') && in_array($manuscriptId, session('viewed_manuscripts'))) {
        return response()->json(['message' => 'You have already viewed this manuscript during this session.'], 200);
    }

    // Increment the view count
    $manuscript = ManuscriptProject::find($manuscriptId);
    if ($manuscript) {
        $manuscript->increment('man_doc_view_count');
    }

    // Add the manuscript to the session as viewed
    session()->push('viewed_manuscripts', $manuscriptId);

    return response()->json(['message' => 'View count incremented successfully.'], 200);
}


}
