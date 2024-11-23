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
    /**
     * Retrieve comments for a specific manuscript.
     */
    public function index($manuscriptId)
    {
        $comments = DocComment::where('man_doc_id', $manuscriptId)
            ->whereNull('parent_id') // Fetch only top-level comments
            ->with('replies') // Include replies
            ->with('user') // Include user information
            ->latest()
            ->get();

        return response()->json($comments);
    }

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


    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:500',
            'manuscript_id' => 'required|exists:manuscripts,id',
            'parent_id' => 'nullable|exists:doc_comments,id',
            'commentable_type' => 'nullable|string|in:Manuscript,OtherModel',
        ]);

        $comment = DocComment::create([
            'content' => $request->input('content'),
            'man_doc_id' => $request->input('manuscript_id'),
            'parent_id' => $request->input('parent_id'),
            'user_id' => Auth::id(), // Assuming logged-in user is posting the comment
        ]);

        broadcast(new CommentAdded($comment, $request->input('manuscript_id')));

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
