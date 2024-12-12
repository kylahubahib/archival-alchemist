<?php

namespace App\Http\Controllers;

use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;



class ForumCommentController extends Controller
{
    public function index($postId)
    {
        $comments = ForumComment::where('forum_post_id', $postId)
            ->whereNull('parent_id') // Only top-level comments
            ->with(['user', 'replies.user'])
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request)
    {
        Log::info('Request Data:', $request->all());

        $request->validate([
            'forum_post_id' => 'required|exists:forum_posts,id',
            'comment' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:forum_comments,id',
        ]);

        $comment = ForumComment::create([
            'forum_post_id' => $request->forum_post_id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'parent_id' => $request->parent_id,
        ]);

        return response()->json($comment->load('user'));
    }

    public function update(Request $request, $id)
    {
        Log::info('Update Request:', $request->all());

        // Validate the request
        $request->validate([
            'comment' => 'required|string|max:1000',
        ]);
        
    
        // Find the comment
        $comment = ForumComment::findOrFail($id);
    
        // Check if the authenticated user is the owner of the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        // Update the comment
        $comment->update(['comment' => $request->comment]);
    
        // Return the updated comment
        return response()->json($comment);
    }
    

    public function destroy($id)
    {
        $comment = ForumComment::findOrFail($id);

        Log::info('Comment Deletion Request:', ['comment_id' => $id, 'user_id' => Auth::id()]);


        if ($comment->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
