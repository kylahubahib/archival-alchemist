<?php

// app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;

class PostController extends Controller
{
    public function show($id)
    {
        $post = Post::with('user')->findOrFail($id);

        return Inertia::render('PostDetails', [
            'post' => [
                'title' => $post->title,
                'content' => $post->content,
                'views' => $post->views,
                'comments' => $post->comments_count,
                'tags' => $post->tags->pluck('name'),
                'created_at' => $post->created_at->diffForHumans(),
                'user' => [
                    'name' => $post->user->name,
                    'avatar' => $post->user->avatar_url,
                ],
            ],
        ]);
    }
}
