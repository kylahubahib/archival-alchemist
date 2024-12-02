<?php

namespace App\Http\Controllers;

use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;



class ForumCommentController extends Controller
{
    public function index($postId)
{
    $comments = ForumComment::where('forum_post_id', $postId)
        ->with('user') // Include related user data
        ->get();

    return response()->json([
        'comments' => $comments,
    ]);
}


public function store(Request $request)
{
    $validated = $request->validate([
        'forum_post_id' => 'required|exists:forum_posts,id',
        'user_id' => 'required|exists:users,id',
        'comment' => 'required|string|max:500',
    ]);

    Log::info($request->get('comment'));

    $comment = ForumComment::create([
        'forum_post_id' => $validated['forum_post_id'],
        'user_id' => $request->user_id ?? Auth::id(),
        'comment' => $validated['comment']
    ]);

    // Log the created comment details
    Log::info('Created comment:', $comment->toArray());

    return response()->json([
        'message' => 'Comment saved successfully.',
        'comment' => $comment,
    ], 201);
}







        
}
