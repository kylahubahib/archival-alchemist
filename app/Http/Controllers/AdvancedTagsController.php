<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tags;
use App\Models\UserLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdvancedTagsController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tags = Tags::paginate(100);

        return Inertia::render('SuperAdmin/Advanced/Tags/Tags', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/Advanced/Tags/Tags');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'tags_name' => 'required|string|unique:tags',
        ]);

        $tag = Tags::create([
            'tag_name' => $request->tag_name
        ]);

        if ($tag) {
            UserLog::create([
                'user_id' => Auth::id(),
                'log_activity' => 'Created Tag',
                'log_activity_content' => "Added a new tag with the name <strong>{$request->tag_name}</strong>.",
            ]);
        }

        return redirect(route('manage-tags.index'));
    }
    /**
     * Display the specified resource.
     */
    public function show($id): Response
    {
        $tags = Tags::find($id);

        return Inertia::render('SuperAdmin/Advanced/Tags/Tags', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        $tags = Tags::find($id);

        return Inertia::render('SuperAdmin/Advanced/Tags/Tags', [
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        Log::info('Update request received for tags ID: ' . $id);
        Log::info('Update request data: ', $request->all());

        $request->validate([
            'tags_name' => 'required|string'
        ]);

        $tags = Tags::find($id);
        $oldTagName = $tags->tag_name;

        $tags->update([
            'tags_name' => $request->tag_name
        ]);

        if ($request->tag_name) {
            UserLog::create([
                'user_id' => Auth::id(),
                'log_activity' => 'Updated Tag',
                'log_activity_content' => "Updated tag name from <strong>{$oldTagName}</strong> to <strong>{$request->tag_name}</strong>.",
            ]);
        }

        return redirect(route('manage-tags.index'));
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        // Find the tag by ID
        $tag = Tags::find($id);

        // Check if the tag exists
        if (!$tag) {
            // Redirect with error if tag is not found
            return redirect(route('manage-tags.index'))->with('error', 'Tag not found.');
        }

        // Log the deletion of the tag
        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Deleted Tag',
            'log_activity_content' => "Deleted tag <strong>{$tag->tag_name}</strong>.",
        ]);

        // Delete the tag
        $tag->delete();

        // Return success message after deletion
        return redirect(route('manage-tags.index'))->with('success', 'Tag deleted successfully.');
    }
}
