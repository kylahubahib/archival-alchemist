<?php

namespace App\Http\Controllers;

use App\Events\NewPostCreated;
use App\Models\ForumPost;
use App\Models\ForumComment;
use App\Models\ForumTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB; // Import DB facade
use Inertia\Inertia;
use Illuminate\Database\Eloquent\ModelNotFoundException;



class ForumPostController extends Controller
{
    // Fetch all forum posts with the associated user relationship
    public function index(Request $request)
{
    // Get the sort and filter parameters from the request
    $sort = $request->input('sort', 'latest');
    $titleFilter = $request->input('title', '');
    $authorFilter = $request->input('author', '');  // Username or user ID
    $tagsFilter = $request->input('tags', []);  // Array of tags

    // Initialize query for forum posts
    $postsQuery = ForumPost::with(['user', 'tags']);

    // Apply title filter if provided
    if ($titleFilter) {
        $postsQuery->where('title', 'like', '%' . $titleFilter . '%');
    }

    // Apply author filter if provided (filter by user ID or username)
    if ($authorFilter) {
        $postsQuery->whereHas('user', function ($query) use ($authorFilter) {
            // You can filter by user ID or username, depending on your requirement
            $query->where('name', 'like', '%' . $authorFilter . '%')
                  ->orWhere('id', '=', $authorFilter);
        });
    }

    // Apply tags filter if provided
    if (!empty($tagsFilter)) {
        $postsQuery->whereHas('tags', function ($query) use ($tagsFilter) {
            $query->whereIn('name', $tagsFilter); // Assuming tags are stored as strings in the 'name' field
        });
    }

    // Apply sorting based on the 'sort' parameter
    if ($sort === 'latest') {
        $postsQuery->orderBy('created_at', 'desc');
    } else if ($sort === 'oldest') {
        $postsQuery->orderBy('created_at', 'asc');
    }

    // Fetch the posts after applying filters and sorting
    $posts = $postsQuery->get();

    // Log fetched posts for debugging
    \Log::info('Filtered Forum Posts Retrieved:', $posts->toArray());

    // Format posts for the response
    $formattedPosts = $posts->map(function ($post) {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'body' => $post->body,
            'viewCount' => $post->viewCount,
            'user' => $post->user,
            'created_at' => $post->formatted_created_at,
            'tags' => $post->tags->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name ?? 'Unnamed Tag', // Set default for null names
                ];
            }),
        ];
    });

    return response()->json($formattedPosts);
}


public function search(Request $request)
    {
        $query = $request->input('query');
        
        $posts = ForumPost::with('user') // Eager load the user relationship
            ->where('title', 'like', "%{$query}%")
            ->orWhereHas('user', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->get();
        
        return response()->json($posts);
    }


    // Store a new forum post
    public function store(Request $request)
{
    // Log CSRF token and incoming request data
    Log::info('CSRF Token:', [$request->header('X-CSRF-TOKEN')]);
    Log::info('Incoming Request Data:', $request->all());

    // Validate the incoming request
    try {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::error('Validation Error:', [$e->errors()]);
        return response()->json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
    }

    // Get the authenticated user
    $user = Auth::user();

    // Ensure the user is authenticated
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    // Initialize the post variable
    $post = null;

    try {
        // Use DB transaction to handle multiple actions
        DB::transaction(function () use ($request, $user, &$post) {
            // Create a new forum post
            $post = ForumPost::create([
                'title' => $request->title,
                'body' => $request->body,
                'user_id' => $user->id,
            ]);

            // Sync the tags with the post
            if (!empty($request->tags)) {
                $tagIds = [];

                // Process each tag
                foreach ($request->tags as $tagName) {
                    // Find or create the tag by name
                    $tag = ForumTag::firstOrCreate(['name' => trim($tagName)]);
                    $tagIds[] = $tag->id; // Collect the tag's ID
                }

                // Attach the tags to the post
                $post->tags()->sync($tagIds);
                Log::info('Tags synced with post ID ' . $post->id, ['tags' => $tagIds]);
            }

            // Broadcast the new post event to other users
            broadcast(new NewPostCreated($post))->toOthers();
        });

        // Load user and tags relationship to include in the response
        $post->load('user', 'tags'); // Make sure to load tags here as well

        Log::info('Created Post:', [$post]);
        return response()->json($post, 201); // Return the created post
    } catch (\Illuminate\Database\QueryException $e) {
        Log::error('Database Error: ' . $e->getMessage());
        return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
    } catch (\Exception $e) {
        Log::error('Error creating post: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to create post: ' . $e->getMessage()], 500);
    }
}

    


    // Show a specific forum post
    public function show($id)
{
    \Log::info("Fetching post with ID: $id");

    try {
        // Fetch the post with user and tags relationships
        $post = ForumPost::with(['user', 'tags'])->findOrFail($id);

        // Increment the view count
        $post->increment('viewCount');

        // Return the post as a JSON response
        return response()->json($post);
    } catch (ModelNotFoundException $e) {
        // Handle the case where the post is not found
        return response()->json(['message' => 'Post not found'], 404);
    } catch (\Exception $e) {
        // Handle other exceptions
        \Log::error("An error occurred: " . $e->getMessage());
        return response()->json(['message' => 'An error occurred'], 500);
    }
}




    // Delete a forum post
    public function destroy($id)
    {
        // Find the post by ID
        $post = ForumPost::find($id);
        
        // If the post doesn't exist, return a 404 error
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Delete the post
        $post->delete();

        // Return a success response
        return response()->json(['message' => 'Post deleted successfully'], 200);
    }

    
        public function incrementViewCount($id)
        {
            $post = ForumPost::findOrFail($id);
            $post->increment('viewCount'); // Increment the view count
            return response()->json(['views' => $post->viewCount]);
        }
        

        public function faq()
        {
            return Inertia::render('FAQ'); // Assuming the file is located in resources/js/Pages/FAQ.jsx
        }


}