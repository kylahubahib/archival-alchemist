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

        $comments = ForumComment::where('post_id', $postId)->get();

        return response()->json($comments);
    }

    public function store(Request $request)
{
    try {
        // Your logic to save the comment
        $comment = new ForumComment();
        $comment->post_id = $request->post_id;
        $comment->user_id = auth()->id();
        $comment->body = $request->body;
        $comment->save();
        
        return response()->json($comment, 201);
    } catch (\Exception $e) {
        Log::error('Error saving comment: ' . $e->getMessage());
        return response()->json(['error' => 'Something went wrong.'], 500);
    }

}
}