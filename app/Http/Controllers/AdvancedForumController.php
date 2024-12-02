<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\ForumPost;
use Inertia\Inertia;

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
     * Display the specified resource.
     */
    public function show(string $id)
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
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
