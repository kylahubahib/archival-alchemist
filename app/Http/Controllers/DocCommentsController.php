<?php

namespace App\Http\Controllers;
use App\Events\NewComment;

use App\Events\CommentAdded;
use App\Models\DocComment;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocCommentsController extends Controller
{
        // Fetch comments with replies
        public function getComments($documentId)
        {
            $comments = DocComment::where('man_doc_id', $documentId)
                ->whereNull('parent_id')
                ->with(['replies', 'user', 'replies.user']) // Load replies and their users
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($comments);
        }

    /**
     * Retrieve comments for a specific manuscript.
     */
    // public function index($manuscriptId)
    // {
    //     $comments = DocComment::where('man_doc_id', $manuscriptId)
    //         ->whereNull('parent_id') // Fetch only top-level comments
    //         ->with('replies') // Include replies
    //         ->with('user') // Include user information
    //         ->latest()
    //         ->get();

    //     return response()->json($comments);
    // }

    /**
     * Store a new comment.
     */
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'content' => 'required|string|max:500',
    //         'manuscript_id' => 'required|exists:manuscripts,id',
    //         'parent_id' => 'nullable|exists:doc_comments,id',
    //         'commentable_type' => 'nullable|string|in:Manuscript,OtherModel', // Make sure to define allowed types
    //     ]);

    //     $comment = DocComment::create([
    //         'content' => $request->input('content'),
    //         'man_doc_id' => $request->input('manuscript_id'),
    //         'parent_id' => $request->input('parent_id'),
    //         'user_id' => Auth::id(),
    //         'commentable_type' => $request->input('commentable_type') ?? 'Manuscript', // You can set a default value here
    //     ]);

    //     return response()->json($comment, 201);
    // }



// Controller snippet
public function storeComment(Request $request)
{
    // Check if the user is authenticated
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Validate the incoming request data
    $request->validate([
        'content' => 'required|string|max:500',
        'manuscript_id' => 'required|exists:manuscripts,id', // 'manuscript_id' comes from the request
        'parent_id' => 'nullable|exists:doc_comments,id',
        'commentable_type' => 'nullable|string|in:Manuscript,OtherModel',
    ]);

    // Create the new comment in the database
    $comment = DocComment::create([
        'content' => $request->input('content'),
        'man_doc_id' => $request->input('manuscript_id'), // Save as man_doc_id
        'parent_id' => $request->input('parent_id'), // Parent ID if replying to another comment
        'user_id' => Auth::id(), // Store the logged-in user's ID
    ]);

    // Broadcast the new comment (real-time update)
    // broadcast(new NewComment($comment, $request->input('manuscript_id'))); // Pass the manuscript_id here

    // Return the newly created comment as JSON
    return response()->json($comment);
}

    /**
     * Delete a comment.
     */
    public function destroy($id)
    {
        $comment = DocComment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
