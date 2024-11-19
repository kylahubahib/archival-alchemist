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

class GoogleController extends Controller
{

    /**
     * Redirect to Google authentication page
     */
    public function redirectToGoogle() 
    {
        $parameters = ['access_type' => 'offline', "prompt" => "consent select_account"];
  
        return Socialite::driver('google')
        ->scopes([
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/documents',
        ])
        ->with($parameters)
        ->redirect();
    }

    /**
     * Handle the callback from Google
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            \Log::info((array)$googleUser);

            // Check if the logged-in user already has a Google account linked
            $user = Auth::user();

            if ($user->google_user_id === null) {
                // If `google_user_id` is null, update the user’s Google account info
                $user->update([
                    'google_user_id' => $googleUser->id,
                    'google_access_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                    'google_token_expiry' => now()->addSeconds($googleUser->expiresIn),
                ]);
            } else {
                // If user exists and already has a Google ID, update the tokens only
                $user->update([
                    'google_access_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                    'google_token_expiry' => now()->addSeconds($googleUser->expiresIn)
                ]);
            }

            // Redirect the user to the library page
            return redirect()->route('library');

        } catch (\Exception $e) {
            \Log::error('Google 0Auth Callback Error: ' . $e->getMessage());
            return redirect('login')->withErrors(['error' => 'Failed to authenticate with Google.']);
        }
    }


    public function promptGoogleConnection()
    {
        return Inertia::render('Auth/ConnectToGoogle');
    } 

}
