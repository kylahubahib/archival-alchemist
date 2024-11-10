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

        $hero = CustomContent::with('user')
            ->where('content_type', 'hero page')
            ->first();

        $services = CustomContent::with('user')
            ->where('content_type', 'our services')
            ->get();

        //$services = CustomContent::where('id', 56)->first();

        $team = CustomContent::with('user')
            ->where('content_type', 'our team')
            ->get();

        return Inertia::render('SuperAdmin/Advanced/CustomMessages/CustomMessages', [
            'customMessages' => $customMessages,
            'billingAgreement' => $billingAgreement,
            'hero' => $hero,
            'services' => $services,
            'team' => $team
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $content_type = $request->get('content_type');

         $data = CustomContent::findOrFail($id);

        if ($content_type === 'hero page') {
            $request->validate([
                'content_text' => 'required|string|max:5000',
                'content_title' => 'required|string|max:255',
                'subject' => 'required|string',
            ]);

            $data->update([
                'content_text' => $request->content_text,
                'content_title' => $request->content_title,
                'subject' => $request->subject, 
            ]);
        } 

        elseif ($content_type === 'our services' || $content_type === 'our team') {

            $request->validate([
                'content_text' => 'required|string|max:5000',
                'content_title' => 'required|string|max:255',
            ]);

            $data->update([
                'content_text' => $request->content_text,
                'content_title' => $request->content_title
            ]);
        }

        return redirect(route('manage-custom-messages.index'))->with('success', 'Updated successfully.');
    }

    public function updateIcon(Request $request)
    {
        $file = $request->file('subject');
        $title = $request->get('content_title');
        $id = $request->get('id');

        $imageName = $title . '_' . time() . '.' . $file->extension();
        $request->subject->move(public_path('storage/images'), $imageName);

        $data = CustomContent::findOrFail($id);

        $data->update([
            'subject' => 'storage/images/' . $imageName
        ]);

        return response()->json();

    }

    public function storeService(Request $request)
    {
        $request->validate([
            'content_text' => 'required|string|max:5000',
            'content_title' => 'required|string|max:255',
            'subject' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        $imageName = $request->content_title . '_' . time().'.'.$request->subject->extension();
        $request->subject->move(public_path('storage/images'), $imageName);


        CustomContent::create([
            'user_id' => Auth::id(),
            'content_type' => 'our services',
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'subject' => 'storage/images/' . $imageName
        ]);

        // return response()->json(['message' => 'Service added successfully!']);
        return redirect(route('manage-custom-messages.index'))->with('success', 'Updated successfully.');
    }

    public function storeTeam(Request $request)
    {
        $request->validate([
            'content_text' => 'required|string|max:5000',
            'content_title' => 'required|string|max:255',
            'subject' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        $imageName = $request->content_title . '_' . time().'.'.$request->subject->extension();
        $request->subject->move(public_path('storage/images'), $imageName);

        CustomContent::create([
            'user_id' => Auth::id(),
            'content_type' => 'our team',
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'subject' => 'storage/images/' . $imageName
        ]);

        //return response()->json(['message' => 'Team added successfully!']);
        return redirect(route('manage-custom-messages.index'))->with('success', 'Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        CustomContent::find($id)->delete();

        return redirect(route('manage-custom-messages.index'))->with('success', 'Deleted successfully.');
    }

    
}
