<?php

namespace App\Http\Controllers;

use App\Models\Tags;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class TagController extends Controller
{
    /**
     * Display a listing of the tags.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tags = Tags::all();
        return response()->json($tags);
    }

    /**
     * Store a newly created tag in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tags_name' => 'required|string|max:255|unique:tags,tags_name',
        ]);

        $tag = Tags::create([
            'tags_name' => $validated['tags_name'],
        ]);

        return response()->json($tag, 201);
    }

    /**
     * Display the specified tag.
     *
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\Http\Response
     */
    public function show(Tags $tag)
    {
        return response()->json($tag);
    }

    /**
     * Update the specified tag in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tags  $tag
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tags $tag)
    {
        $validated = $request->validate([
            'tags_name' => 'required|string|max:255|unique:tags,tags_name,' . $tag->id,
        ]);

        $tag->update([
            'tags_name' => $validated['tags_name'],
        ]);

        return response()->json($tag);
    }

    /**
     * Remove the specified tag from storage.
     *
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tags $tag)
    {
        $tag->delete();
        return response()->json(['message' => 'Tag deleted successfully.']);
    }

    /**
     * Search for tags based on the query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function suggestions(Request $request)
    {
        $query = $request->input('query');
        $tags = Tags::where('tags_name', 'like', "%{$query}%")->get();
        return response()->json($tags);
    }

    /**
     * Get existing tags.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function existingTags(Request $request)
    {
        Log::info('Fetching existing tags');
        $tags = Tags::all();
        return response()->json($tags);
    }

    /**
     * Store multiple tags.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeTags(Request $request)
    {
        $tags = $request->input('tags', []);
        $existingTags = Tags::pluck('tags_name')->map('strtolower')->toArray(); // Get existing tags in lowercase

        foreach ($tags as $tag) {
            $tag = strtolower($tag); // Convert to lowercase
            if (!in_array($tag, $existingTags)) {
                Tags::create(['tags_name' => $tag]);
                $existingTags[] = $tag; // Update existingTags to include the newly added tag
            }
        }

        return response()->json(['message' => 'Tags saved successfully.']);
    }

    /**
     * Get tag IDs based on tag names.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getTagIds(Request $request)
{
    $request->validate([
        'tags_name' => 'required|array',
        'tags_name.*' => 'string'
    ]);

    $tagNames = $request->input('tags_name');
    $tags = Tags::whereIn('tags_name', $tagNames)->get();

    // Map tag names to IDs
    $tagIds = $tags->pluck('id', 'tags_name')->only($tagNames)->values();

    return response()->json(['tag_ids' => $tagIds]);
}

}
