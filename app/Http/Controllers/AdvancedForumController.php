<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\ForumPost;
use App\Models\ForumComment;
use Inertia\Inertia;
use App\Models\CustomContent;
use App\Models\User;
use App\Notifications\InstitutionAdminNotification;
use App\Notifications\UserNotification;

class AdvancedForumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $forumPost = ForumPost::with(['user', 'tags'])->get();

        return Inertia::render('SuperAdmin/Advanced/Forum/Forum', [
            'forumPost' => $forumPost,
        ]);
    }

    public function filterPost(Request $request)
    {
        $filter = $request->get('filter');
        \Log::info('Starting...');

        $query = ForumPost::with(['user', 'tags']);

        switch ($filter) {
            case 'latest_post':
                $query->orderBy('created_at', 'desc');
                break;

            case 'most_popular':
                $query->orderBy('view_count', 'desc');
                break;

            // case 'most_comment':
            //     $query->withCount('comments')->orderBy('comments_count', 'desc');
            //     break;

            case 'visible_post':
                $query->where('status', 'Visible'); 
                break;

            case 'hidden_post':
                $query->where('status', 'Hidden'); 
                break;

            case 'deleted_post':
                $query->where('status', 'Deleted'); 
                break;

            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $filteredPosts = $query->get();

        return response()->json(['filteredPosts' => $filteredPosts]);
    }



     /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comments = ForumComment::with('user:id,user_pic,email,name')->where('forum_post_id', $id)->get();

        return response()->json([
            'comments' => $comments
        ]);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $forumPost = ForumPost::find($id);

        $forumPost->update([
            'status' => 'Hidden'
        ]);

        return redirect(route('manage-forum-posts.index'))->with('success', 'Status updated.');
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
