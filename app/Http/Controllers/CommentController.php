<?php

namespace App\Http\Controllers;

use App\Models\DocComment;
use Illuminate\Http\Request;

class CommentController extends Controller
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

    // Store a new comment or reply
    public function storeComment(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:500',
            'man_doc_id' => 'required|integer',
            'user_id' => 'required|integer',
            'parent_id' => 'nullable|integer', // parent_id can be null or a valid ID
        ]);

        $comment = DocComment::create([
            'content' => $request->content,
            'man_doc_id' => $request->man_doc_id,
            'user_id' => $request->user_id,
            'parent_id' => $request->parent_id, // If it's a reply, parent_id is set
        ]);

        return response()->json($comment);
    }
}
