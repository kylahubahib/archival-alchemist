<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class TagsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tags = Tag::paginate(10);

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
            'tag_name' => 'required|string|unique:tags',
        ]);

        Tag::create([
            'tag_name' => $request->tag_name
        ]);

        return redirect(route('manage-tags.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show($id): Response
    {
        $tags = Tag::find($id);

        return Inertia::render('SuperAdmin/Advanced/Tags/Tags', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        $tags = Tag::find($id);

        return Inertia::render('SuperAdmin/Advanced/Tags/Tags', [
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        \Log::info('Update request received for tags ID: ' . $id);
        \Log::info('Update request data: ', $request->all());

        $request->validate([
            'tag_name' => 'required|string'
        ]);

        $tags = Tag::find($id);

        $tags->update([
            'tag_name' => $request->tag_name
        ]);

        return redirect(route('manage-tags.index'));
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        Tag::find($id)->delete();

        return redirect(route('manage-tags.index'));
    }


}
