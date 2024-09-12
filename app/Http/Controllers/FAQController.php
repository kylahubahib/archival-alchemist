<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CustomContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class FAQController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = CustomContent::with('user')
            ->where('content_type', 'frequently asked questions')
            ->paginate(100);

        return Inertia::render('SuperAdmin/FrequentlyAskedQuestions/Faq', [
            'faqs' => $faqs
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/FrequentlyAskedQuestions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'content_title' => 'required|string|max:1000',
            'content_text' => 'required|string',
        ]);

        CustomContent::create([
            'user_id' => Auth::id(),
            'content_type' => 'frequently asked questions',
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'subject' => null,
        ]);

        return redirect(route('manage-faqs.index'))->with('success', 'FAQ created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id): Response
    {
        $faqs = CustomContent::with('user')->find($id);

        return Inertia::render('SuperAdmin/FrequentlyAskedQuestions/Faq', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        $faqs = CustomContent::with('user')->find($id);

        return Inertia::render('SuperAdmin/FrequentlyAskedQuestions/Faq', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        \Log::info('Update request received for faq ID: ' . $id);
        \Log::info('Update request data: ', $request->all());

        $request->validate([
            'content_title' => 'required|string|max:1000',
            'content_text' => 'required|string',
        ]);

        $faq = CustomContent::find($id);

        // Update content_title and content_text
        $faq->update([
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'user_id' => Auth::id(),
        ]);

        return redirect(route('manage-faqs.index'))->with('success', 'FAQ updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        CustomContent::find($id)->delete();

        return redirect(route('manage-faqs.index'))->with('success', 'FAQ deleted successfully.');
    }

    public function change_status(Request $request, $id): RedirectResponse
    {

    $faq = CustomContent::find($id);


    if ($faq->content_status === 'available') {
        $faq->update([
            'content_status' => 'unavailable',
        ]);
    } else if ($faq->content_status === 'unavailable') {
        $faq->update([
            'content_status' => 'available',
        ]);
    } else {
        \Log::info('Something went wrong');
    }


    return redirect(route('manage-faqs.index'))->with('success', 'Status updated.');
    }

}
