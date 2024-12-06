<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Socialite;
use Google\Client as GoogleClient;
use Google\Service\Docs as GoogleDocs;
use Carbon\Carbon;


use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class GoogleController extends Controller
{

    /**
     * Redirect to Google authentication page
     */
    public function redirectToGoogle()
    {

        $user = Auth::user();

        if($user)
        {
            $parameters = ['access_type' => 'offline', "prompt" => "consent", 'login_hint' => $user->email,];
                return Socialite::driver('google')
                ->scopes([
                    'https://www.googleapis.com/auth/drive.file',
                    'https://www.googleapis.com/auth/documents',
                ])
                ->with($parameters)
                ->redirect();
        }
        else 
        {   
            $parameters = ['access_type' => 'offline', "prompt" => "consent",];
                return Socialite::driver('google')
                ->scopes([
                    'https://www.googleapis.com/auth/drive.file',
                    'https://www.googleapis.com/auth/documents',
                ])
                ->with($parameters)
                ->redirect();
        }
    }

    /**
     * Handle the callback from Google
     */
    // public function handleGoogleCallback()
    // {
    //     \Log::info('Checking google...');

    //     try {
    //         $googleUser = Socialite::driver('google')->stateless()->user();

    //         \Log::info('Google:', (array)$googleUser);

    //         // Check if the logged-in user already has a Google account linked
    //         $user = Auth::user();

    //         if ($user->google_user_id === null) {
    //             // If `google_user_id` is null, update the user’s Google account info
    //             $user->update([
    //                 'google_user_id' => $googleUser->id,
    //                 'google_access_token' => $googleUser->token,
    //                 'google_refresh_token' => $googleUser->refreshToken,
    //                 'google_token_expiry' => now()->addSeconds($googleUser->expiresIn),
    //             ]);
    //         } else {
    //             // If user exists and already has a Google ID, update the tokens only
    //             $user->update([
    //                 'google_access_token' => $googleUser->token,
    //                 'google_refresh_token' => $googleUser->refreshToken,
    //                 'google_token_expiry' => now()->addSeconds($googleUser->expiresIn)
    //             ]);
    //         }

    //         // Redirect the user to the library page
    //         if($user->user_type === 'institution_admin')
    //         {
    //             return redirect()->route('institution-students');

    //         } else {
    //             return redirect()->route('library');
    //         }

    //     } catch (\Exception $e) {
    //         \Log::error('Google 0Auth Callback Error: ' . $e->getMessage());
    //         return redirect('login')->withErrors(['error' => 'Failed to authenticate with Google.']);
    //     }
    // }
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            \Log::info('Google User:', (array) $googleUser);

            // Check if a user already exists with the Google email
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // If the user exists, update Google credentials
                $user->update([
                    'google_user_id' => $googleUser->id,
                    'google_access_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                    'google_token_expiry' => now()->addSeconds($googleUser->expiresIn),
                ]);

                // Log the user in
                Auth::login($user);
            } else {
                // Create a new user if none exists
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'user_type' => 'general_user',
                    'google_user_id' => $googleUser->id,
                    'google_access_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                    'google_token_expiry' => now()->addSeconds($googleUser->expiresIn),
                    'password' => Hash::make(uniqid()),
                ]);

                Auth::login($user);
            }

            // Redirect based on user type
            if ($user->user_type === 'institution_admin') {
                return redirect()->route('institution-students');
            } else {
                return redirect()->route('library');
            }
        } catch (\Exception $e) {
            \Log::error('Google OAuth Callback Error: ' . $e->getMessage());
            return redirect('login')->withErrors(['error' => 'Failed to authenticate with Google.']);
        }
    }



    public function promptGoogleConnection()
    {
        return Inertia::render('Auth/ConnectToGoogle');
    }


}
