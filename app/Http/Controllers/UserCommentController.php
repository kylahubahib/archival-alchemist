<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserCommentController extends Controller
{
    // Fetch logged-in user details including avatar (user_pic)
    public function getLoggedInUser(Request $request)
    {
        $user = Auth::user(); // Get the currently authenticated user

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->user_pic ? asset('storage/' . $user->user_pic) : null, // Fetch user avatar (user_pic)
        ]);
    }

    // Store a new comment in the database
    public function storeComment(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'text' => 'required|string|max:1000',
        ]);

        // Create a new comment associated with the logged-in user
        $comment = new Comment();
        $comment->user_id = Auth::id();
        $comment->post_id = $request->post_id;
        $comment->text = $request->text;
        $comment->save();

        return response()->json($comment, 201); // Return the created comment
    }
}
