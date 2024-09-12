<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    // public function edit(Request $request): Response
    // {
    //     return Inertia::render('Profile/Edit', [
    //         'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
    //         'status' => session('status'),
    //     ]);
    // }


    public function showProfilePic($filename)
    {
        $path = storage_path('app/public/profile_pics/' . $filename);

        if (!Storage::disk('public')->exists('profile_pics/' . $filename)) {
            abort(404);
        }

        return Response::file($path);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'auth' => [
                'user' => [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'created_at' => $request->user()->created_at,
                    'user_aboutme' => $request->user()->user_aboutme,
                    'user_pic' => $request->user()->user_pic ? asset('storage/profile_pics/' . $request->user()->user_pic) : null,
                ]
            ]
        ]);
    }


    /**
     * Update the user's profile information.
     */
    public function update(Request $request): \Illuminate\Http\JsonResponse
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'uni_id_num' => 'nullable|string|max:11',
            'user_pnum' => 'nullable|string|max:11',
            'user_aboutme' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Update user details
        $user->fill($validated);

        // Reset email verification if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Save user
        $user->save();

        // Return JSON response
        return response()->json(['message' => 'Profile updated successfully!']);
    }

    /**
     * Update the user's profile picture.
     */
    public function updatePicture(Request $request): \Illuminate\Http\JsonResponse
    {
        // Validate request
        $request->validate([
            'user_pic' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // Handle file upload
        if ($request->hasFile('user_pic')) {
            // Delete old profile picture if it exists
            if ($user->user_pic) {
                Storage::disk('public')->delete('profile_pics/' . $user->user_pic);
            }

            // Store new profile picture
            $path = $request->file('user_pic')->store('profile_pics', 'public');
            $user->user_pic = basename($path);
            $user->save();
        }

        // Return JSON response
        return response()->json(['message' => 'Profile picture updated successfully!']);
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
