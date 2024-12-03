<?php

namespace App\Http\Controllers;

use App\Models\ForumComment;
use App\Models\ForumPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;



class ForumCommentController extends Controller
{
    public function index($postId)
    {
        $comments = ForumComment::where('forum_post_id', $postId)
        ->whereNull('parent_id') 
        ->where('status', 'Visible')
        ->with([
            'user', 
            'replies.user' 
        ])->get();

        Log::info($comments->toArray());

        return response()->json([
            'comments' => $comments,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'forum_post_id' => 'required|exists:forum_posts,id',
            'comment' => 'required|string|max:500',
            'parent_id' => 'nullable|integer'
        ]);

        Log::info($request->all());


        Log::info($request->get('comment'));

        $comment = ForumComment::create([
            'forum_post_id' => $validated['forum_post_id'],
            'user_id' => Auth::id(),
            'comment' => $validated['comment'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);
        
        $forum= ForumPost::find($validated['forum_post_id']);
            
        $forum->update([
                'comments' => $forum->comments + 1,
        ]);


        // Log the created comment details
        Log::info('Created comment:', $comment->toArray());

        return response()->json([
            'comment' => $comment->load('user'),
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        // Validate the request
        $request->validate([
            'comment' => 'required|string|max:1000', 
        ]);

        // Find the comment
        $comment = ForumComment::findOrFail($id);

        // Update the comment
        $comment->comment = $request->input('comment');
        $comment->save();

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment,
        ], 200);
    }

    
    public function destroy(string $id)
    {
        $comment = ForumComment::findOrFail($id);

        Log::info($comment);

        ForumComment::where('id', $id)->orWhere('parent_id', $id)->delete();

        return response()->json([
            'message' => 'Comment and its replies deleted successfully',
        ], 200);
    }

        
}
