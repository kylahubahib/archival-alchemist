<?php

namespace App\Http\Controllers;

use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;



class ForumCommentController extends Controller
{
    public function index(Request $request)
    {
        $postId = $request->input('post_id');

        Log::info('Post: ', (array)$postId);

        $comments = ForumComment::where('forum_post_id', $postId)->get();

        return response()->json($comments);
    }

    public function store(Request $request)
{
    try {
        // Your logic to save the comment
        $comment = new ForumComment();
        $comment->forum_post_id = $request->post_id;
        $comment->user_id = auth()->id();
        $comment->body = $request->comment;
        $comment->save();
        
        return response()->json($comment, 201);
    } catch (\Exception $e) {
        Log::error('Error saving comment: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }

}
}