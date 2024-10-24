<?php

namespace App\Http\Controllers;

use App\Models\ForumPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response; // Import the Response facade

class ForumPostController extends Controller
{
    public function index()
    {
        // Fetch all forum posts with associated user relationship
        return ForumPost::with('user')->get();
    }

    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'tags' => 'nullable|array',
        ]);

        // Get the authenticated user
        $user = Auth::user();

        // Check if the user is authenticated
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Create a new forum post with the authenticated user's ID
        $post = ForumPost::create([
            'title' => $request->title,
            'body' => $request->body,
            'tags' => $request->tags,
            'user_id' => $user->id, // Use the authenticated user's ID
        ]);

        return response()->json($post, 201); // Return created post
    }

    public function show($id)
    {
        // Fetch the post by ID with associated user and tags
        $post = ForumPost::with(['user'])->findOrFail($id);

        // Increment view count (assuming you have a 'views' column)

        // Return the post data as an Inertia response
        return inertia('PostDetail', [
            'post' => $post, // Pass the post data to the Inertia view
        ]);
    }

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
    


    // You can add other methods for updating, deleting, etc.
}
