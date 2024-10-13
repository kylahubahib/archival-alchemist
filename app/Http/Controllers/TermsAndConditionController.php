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

class TermsAndConditionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //\Log::info('ok'); 

        $termsConditions = CustomContent::with('user')
            ->where('content_type', 'terms and conditions')
            ->paginate(100);
        
        $billingAgreement = CustomContent::with('user')
            ->where('content_type', 'billing agreement')
            ->first();

        $privacyPolicy = CustomContent::with('user')
            ->where('content_type', 'privacy policy')
            ->first();

        
            //\Log::info('Terms ', $termsConditions->toArray());


        return Inertia::render('SuperAdmin/TermsAndConditions/TermsCondition', [
            'termsConditions' => $termsConditions,
            'billingAgreement' => $billingAgreement,
            'privacyPolicy' => $privacyPolicy,
        ]);
    }

    public function getTermsAndConditions()
    {
        $terms = CustomContent::where('content_type', 'terms and conditions');

        return response()->json($terms);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/TermsAndConditions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'content_title' => 'required|string|max:1000',
            'content_text' => 'required|string',
        ], [], [
            'content_title' => 'title',
            'content_text' => 'text',
        ]);
        

        CustomContent::create([
            'user_id' => Auth::id(),
            'content_type' => 'terms and conditions',
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'subject' => null,
        ]);

        return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Terms and conditions created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomContent $termsAndCondition): Response
    {

        return Inertia::render('SuperAdmin/TermsAndConditions/Show', [
            'termConditions' => $termsAndCondition,
        ]);
    }

    /**
     * If the above method didnt work try using this:
     * public function show($id): Response
     *{
     *    $termsConditions = CustomContent::find($id);
     *
     *   return Inertia::render('SuperAdmin/TermsAndConditions/Show', [
     *      'termConditions' => $termsAndCondition,
     *    ]);
     *}
     */


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomContent $termsAndCondition): Response
    {
        return Inertia::render('SuperAdmin/TermsAndConditions/Edit', [
            'termConditions' => $termsAndCondition->load('user'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        //\Log::info('Update request received for tc ID: ' . $id);
        //\Log::info('Update request data: ', $request->all());

        $request->validate([
            'content_title' => 'required|string|max:1000',
            'content_text' => 'required|string',
        ], [], [
            'content_title' => 'title',
            'content_text' => 'text',
        ]);

        $data = CustomContent::find($id);

        // if($data->content_type === 'terms and conditions')
        // {

        // }

        // Update content_title and content_text
        $data->update([
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'user_id' => Auth::id(),
        ]);

        return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Terms and conditions updated successfully.');

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        CustomContent::find($id)->delete();

        return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Terms and conditions deleted successfully.');
    }

    public function change_status(Request $request, $id): RedirectResponse
    {

    $termsAndCondition = CustomContent::find($id);


    if ($termsAndCondition->content_status === 'available') {
        $termsAndCondition->update([
            'content_status' => 'unavailable',
        ]);
    } else if ($termsAndCondition->content_status === 'unavailable') {
        $termsAndCondition->update([
            'content_status' => 'available',
        ]);
    } else {
        \Log::info('Something went wrong');
    }


    return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Status updated.');
    }


}
