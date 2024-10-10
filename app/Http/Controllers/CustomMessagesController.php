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

class CustomMessagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customMessages = CustomContent::with('user')
            ->where('content_type', 'custom messages')
            ->get();

        $billingAgreement = CustomContent::with('user')
        ->where('content_type', 'billing agreement')
        ->first();

        return Inertia::render('SuperAdmin/Advanced/CustomMessages/CustomMessages', [
            'customMessages' => $customMessages,
            'billingAgreement' => $billingAgreement
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
        $type = $request->get('content_type');
        $content = $request->get('content_text');

        if($type === 'billing agreement') {
            $BillingAgreement = CustomContent::findOrFail($id);

            $BillingAgreement->update([
                'content_text' => $content
            ]);

        }

        return redirect(route('manage-custom-messages.index'))->with('success', 'Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
