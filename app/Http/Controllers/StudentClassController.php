<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use App\Models\Author;
use Illuminate\Support\Facades\File;
use Illuminate\Http\JsonResponse;
use App\Models\ClassModel;
use App\Models\Rating;
use App\Models\ManuscriptProject;
use App\Models\ManuscriptTag;

use Illuminate\Support\Facades\DB;
use App\Models\Favorite;
use App\Models\Tags;
use App\Models\User;
use App\Models\ClassStudent;
use App\Models\RevisionHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


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
        Log::info('Request Data:', $request->all());
        try {
            $validatedData = $request->validate([
                'man_doc_title' => 'required|string|max:255',
                'man_doc_adviser' => 'required|string|max:255',
                'man_doc_author' => 'nullable|array',
                'man_doc_author.*' => '.string|max:255',
                'tags_name' => 'nullable|array', // Change this line to match your input key
                'tags_name.*' => 'string|max:255', // Validate individual tag names
                'man_doc_content' => 'required|file|mimes:pdf,docx|max:20480',

            ]);

            //Get the class code using request
            $classCode = $request->get('class_code');

            // Use the correct key to get tags from the request
            $tags = $request->get('tags_name', []); // Change from 'tags' to 'tags_name'

            // Use the correct key to get tags from the request
            $users = $request->get('name', []); // Change from 'tags' to 'tags_name'

            // Store the file in the capstone_files directory
            $filePath = $request->file('man_doc_content')->storeAs('capstone_files', time() . '_' . $request->file('man_doc_content')->getClientOriginalName(), 'public');


            // Create the manuscript project
            $manuscriptProject = ManuscriptProject::create([
                'man_doc_title' => $validatedData['man_doc_title'],
                'man_doc_adviser' => $validatedData['man_doc_adviser'],
                'man_doc_content' => 'storage/' . $filePath, // Save the path for database
                'class_code' => $validatedData['class_id'] ?? null,
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
            }

            if($manuscriptProject)
            {
                $class = ClassModel::where('class_code', $classCode)->first();
                $faculty = $class->ins_id;

                RevisionHistory::create([
                    'ins_comment' => null,
                    'man_doc_id' => $manuscriptProject->id,
                    'ins_id' => $faculty,
                    'uploaded_at' => $manuscriptProject->created_at,
                    'revision_content' => $manuscriptProject->man_doc_content,
                    'status' => 'Started'
                ]);
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
        $class = ClassModel::where('class_code', $request->class_code)->first();

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
        $request->validate([
            'class_code' => 'required|string',
            'class_name' => 'required|string',
            'ins_id' => 'required|integer',
        ]);

        $userId = Auth::id();

        try {
            // Check if the class exists
            $class = ClassModel::where('class_code', $request->class_code)->first();

            if (!$class) {
                return response()->json(['success' => false, 'message' => 'Class code not found']);
            }

            // Check if the user is already enrolled in the class
            $existingEnrollment = ClassStudent::where([
                ['class_id', $class->id],
                ['stud_id', $userId],
            ])->first();

            if ($existingEnrollment) {
                // User is already enrolled
                return response()->json(['success' => true, 'message' => 'Already enrolled']);
            } else {
                // Insert the new enrollment
                ClassStudent::create([
                    'class_id' => $class->id, // Use the class ID from ClassModel
                    'stud_id' => $userId, // Store the user ID
                ]);

                return response()->json(['success' => true, 'message' => 'Joined class successfully']);
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


// public function getPublishedManuscripts(Request $request)
// {
//     try {
//         // Retrieve the 'keyword' query parameter
//         $keyword = $request->query('keyword');
//         Log::info('My keyword: ' . $keyword);

//         // Determine relationships to load based on choice
//         $manuscripts = ManuscriptProject::with(['tags', 'authors'])
//             ->where('is_publish', '1');

//         // If a keyword is provided, filter manuscripts by title
//         if ($keyword) {
//             $manuscripts = $manuscripts->where('man_doc_title', 'like', '%' . $keyword . '%');
//         }

//         $manuscripts = $manuscripts->get(); // Execute the query to get the results

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

        // Initialize manuscripts query
        $manuscripts = ManuscriptProject::with(['tags', 'authors'])
            ->where('is_publish', '1');

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


// SELECT *
// FROM manuscripts mp
// JOIN author a ON mp.id = a.man_doc_id
// WHERE mp.man_doc_status = 'Y'
// AND a.user_id = 31
// LIMIT 0, 25;

public function myApprovedManuscripts() {
    $userId = Auth::id(); // Get the ID of the currently signed-in user

    // Fetch approved manuscripts for the currently authenticated user, including tags and authors
    $manuscripts = ManuscriptProject::with(['tags', 'authors']) // Eager load tags and authors relationships
        ->join('author', 'manuscripts.id', '=', 'author.man_doc_id')
        ->where('manuscripts.man_doc_status', 'Y') // Ensure only approved manuscripts are retrieved
        ->where('author.user_id', $userId) // Filter by the current user
        ->select('manuscripts.*') // Select fields from manuscripts table
        ->get();

    return response()->json($manuscripts, 200);
}

public function myfavoriteManuscripts()
{
    $userId = Auth::id(); // Get the ID of the currently signed-in user

    // Fetch approved manuscripts for the currently authenticated user, including tags and authors
    $manuscripts = ManuscriptProject::with(['tags', 'authors']) // Eager load tags and authors relationships
        ->join('favorites', 'manuscripts.id', '=', 'favorites.man_doc_id')
        ->where('manuscripts.man_doc_status', 'Y') // Ensure only approved manuscripts are retrieved
        ->where('favorites.user_id', $userId) // Filter by the current user
        ->select('manuscripts.*') // Select fields from manuscripts table
        ->get();

    return response()->json($manuscripts, 200);
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


     public function downloadPdf($id)
     {
         $manuscript = ManuscriptProject::findOrFail($id);
         $filename = $manuscript->man_doc_content; // Get the filename from the database

         // Log the filename for debugging
         Log::info('Filename for download: ' . $filename);

         // Ensure the filename has the correct extension
         $filePath = storage_path('app/public/' . str_replace('storage/', '', $filename));

         // Check if the file exists before attempting to download
         if (!file_exists($filePath)) {
             abort(404, 'File not found.');
         }

         // Get the actual filename to be downloaded
         $originalName = basename($filename); // Extract original name from the path
         $extension = pathinfo($originalName, PATHINFO_EXTENSION);

         // Append .pdf if it's not already in the filename
         if (strtolower($extension) !== 'pdf') {
             $originalName .= '.pdf';
         }

         // Return the download response with the correct Content-Type
         return response()->download($filePath, $originalName, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $originalName . '"'
        ]);

     }




public function checkStudentInClass()
{
    // Get the authenticated user
    $user = Auth::user();

    // Check if the user is enrolled in any class
    $studentClass = ClassStudent::where('stud_id', $user->id)->first();

    if ($studentClass) {
        return response()->json([
            'class' => $studentClass->class_id, // Return the class code if enrolled
        ]);
    } else {
        return response()->json(); // Return an empty response if not enrolled
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



// public function storeRatings(Request $request)
// {
//     Log::info('Incoming request: ', $request->all());

//     try {
//         // Check if the user is authenticated
//         if (!Auth::check()) {
//             return response()->json(['error' => 'You need to log in first.'], 401);
//         }

//         // Log request data before validation
//         Log::info('Request data: ', $request->all());

//         // Validate the request
//         $request->validate([
//             'manuscript_id' => 'required|exists:manuscripts,id',
//             'rating' => 'required|integer|between:1,5',
//         ]);

//         // Log user ID for debugging
//         $userId = Auth::id();
//         Log::info('User ID: ' . $userId);

//         // Check if the user has already rated this manuscript
//         $existingRating = Rating::where([
//             'user_id' => $userId,
//             'manuscript_id' => $request->manuscript_id,
//         ])->first();

//         if ($existingRating) {
//             return response()->json(['message' => 'You have already rated this manuscript.'], 409);
//         }

//         // Log data to be used in the updateOrCreate
//         Log::info('Creating rating with data:', [
//             'user_id' => $userId,
//             'manuscript_id' => $request->manuscript_id,
//             'rating' => $request->rating,
//         ]);

//         // Create the new rating
//         $rating = Rating::create([
//             'user_id' => $userId,
//             'manuscript_id' => $request->manuscript_id,
//             'rating' => $request->rating,
//         ]);

//         return response()->json(['message' => 'Rating submitted successfully!', 'rating' => $rating], 201);
//     } catch (\Exception $e) {
//         Log::error('Error submitting rating', [
//             'exception' => $e->getMessage(),
//             'stack' => $e->getTraceAsString(),
//             'request' => $request->all(),
//         ]);
//         return response()->json(['error' => 'Failed to submit rating.'], 500);
//     }
// }



}
