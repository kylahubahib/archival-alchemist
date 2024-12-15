<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CustomContent;
use App\Models\UserLog;
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

        // Capture old values for logging
        $oldContentTitle = $data->content_title;
        $oldContentText = $data->content_text;
        $oldContentSubject = $data->subject;

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

            $logMessage = '';

            // Handle changes in title
            if ($oldContentTitle !== $request->content_title) {
                $logMessage .= "Updated the title of {$content_type} from <strong>{$oldContentTitle}</strong> to <strong>{$request->content_title}</strong>. ";
            }

            // Handle changes in content text
            if ($oldContentText !== $request->content_text) {
                $logMessage .= "Updated the content text of {$content_type} from <strong>{$oldContentText}</strong> to <strong>{$request->content_text}</strong>. ";
            }

            // Handle changes in subject
            if ($oldContentSubject !== $request->subject) {
                $logMessage .= "Updated the subject of {$content_type} from <strong>{$oldContentSubject}</strong> to <strong>{$request->subject}</strong>. ";
            }

            // No changes
            if ($logMessage !== '') {
                UserLog::create([
                    'user_id' => Auth::id(),
                    'log_activity' => 'Updated Hero Page',
                    'log_activity_content' => $logMessage,
                ]);
            }
        } elseif ($content_type === 'our services' || $content_type === 'our team') {

            $request->validate([
                'content_text' => 'required|string|max:5000',
                'content_title' => 'required|string|max:255',
            ]);

            $data->update([
                'content_text' => $request->content_text,
                'content_title' => $request->content_title
            ]);

            $logMessage = '';

            // Handle changes in title
            if ($oldContentTitle !== $request->content_title) {
                $logMessage .= "Updated the title of {$content_type} from <strong>{$oldContentTitle}</strong> to <strong>{$request->content_title}</strong>. ";
            }

            // Handle changes in content text
            if ($oldContentText !== $request->content_text) {
                $logMessage .= "Updated the content text of {$content_type} from <strong>{$oldContentText}</strong> to <strong>{$request->content_text}</strong>. ";
            }

            // Handle changes in subject
            if ($oldContentSubject !== $request->subject) {
                $logMessage .= "Updated the subject of {$content_type} from <strong>{$oldContentSubject}</strong> to <strong>{$request->subject}</strong>. ";
            }

            if ($logMessage !== '') {
                UserLog::create([
                    'user_id' => Auth::id(),
                    'log_activity' => "Updated {$content_type}",
                    'log_activity_content' => $logMessage,
                ]);
            }
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
        $oldSubject = $data->subject;

        $data->update([
            'subject' => 'storage/images/' . $imageName
        ]);

        // Prepare log message
        $logMessage = "Updated the icon for <strong>{$title}</strong>";
        if ($oldSubject) {
            $logMessage .= " from <strong>{$oldSubject}</strong>";
        }
        $logMessage .= " to <strong>storage/images/{$imageName}</strong>.";

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Updated Icon',
            'log_activity_content' => $logMessage,
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

        $imageName = $request->content_title . '_' . time() . '.' . $request->subject->extension();
        $request->subject->move(public_path('storage/images'), $imageName);


        CustomContent::create([
            'user_id' => Auth::id(),
            'content_type' => 'our services',
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'subject' => 'storage/images/' . $imageName
        ]);

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Added New Service',
            'log_activity_content' => "Added a new service with title <strong>{$request->content_title}</strong>, content text <strong>{$request->content_text}</strong>, and subject image <strong>{$imageName}</strong>.",
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

        $imageName = $request->content_title . '_' . time() . '.' . $request->subject->extension();
        $request->subject->move(public_path('storage/images'), $imageName);

        CustomContent::create([
            'user_id' => Auth::id(),
            'content_type' => 'our team',
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'subject' => 'storage/images/' . $imageName
        ]);

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Added New Team Member',
            'log_activity_content' => "Added a new team member named <strong>{$request->content_title}</strong>, with the role of <strong>{$request->content_text}</strong>.",
        ]);

        //return response()->json(['message' => 'Team added successfully!']);
        return redirect(route('manage-custom-messages.index'))->with('success', 'Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $content = CustomContent::findOrFail($id);

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Deleted Content',
            'log_activity_content' => "Deleted a content with title <strong>{$content->content_title}</strong> and type <strong>{$content->content_type}</strong>.",
        ]);

        $content->delete();

        return redirect(route('manage-custom-messages.index'))->with('success', 'Deleted successfully.');
    }
}
