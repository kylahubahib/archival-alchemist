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

            // Redirect the user to the dashboard or desired page
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



    public function uploadDocument(Request $request)
    {
        // Validate the request
        $request->validate([
            'file' => 'required|file|mimes:doc,docx,pdf', 
        ]);

        // Get the authenticated user
        $user = auth()->user();

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setAccessType('offline');

        // Add required scopes
        $client->addScope(GoogleDrive::DRIVE);

        // Set the access token
        $accessToken = $user->google_access_token;

        // Check if the access token is expired
        if (Carbon::now()->greaterThanOrEqualTo(Carbon::parse($user->google_token_expiry))) {
            $client->refreshToken($user->google_refresh_token);
            $newAccessToken = $client->getAccessToken();
            
            // Update the user's token and expiry in the database
            $user->update([
                'google_access_token' => $newAccessToken['access_token'],
                'google_token_expiry' => Carbon::now()->addSeconds($newAccessToken['expires_in']),
            ]);
            
            $accessToken = $newAccessToken['access_token'];
        }

        $client->setAccessToken($accessToken);

        // Initialize Google Drive Service
        $driveService = new GoogleDrive($client);

        // Step 1: Upload the file to Google Drive
        $file = new GoogleDrive\DriveFile();
        $file->setName($request->file->getClientOriginalName());
        $file->setMimeType($request->file->getMimeType());

        // Specify that the file should be converted to Google Docs format
        $uploadOptions = [
            'data' => file_get_contents($request->file->getRealPath()),
            'mimeType' => $request->file->getMimeType(),
            'uploadType' => 'multipart',
            'fields' => 'id',
            'convert' => true, // Convert the file to Google Docs format
        ];

        // Upload the file
        $uploadedFile = $driveService->files->create($file, $uploadOptions);

        // Step 2: Construct the Google Docs URL
        $googleDocsUrl = 'https://docs.google.com/document/d/' . $uploadedFile->id;

        return response()->json([
            'googleDocsUrl' => $googleDocsUrl,
        ]);
    }


   
    public function createGoogleDocument()
    {
        // Get the authenticated user
        $user = auth()->user();

        // Initialize Google Client
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setAccessType('offline');
        
        // Set scope to Google Docs API
        $client->addScope(GoogleDocs::DOCUMENTS);

        // Set the access token
        $accessToken = $user->google_access_token;
        $expiryTime = Carbon::parse($user->google_token_expiry);

        // Check if the access token is expired
        if (Carbon::now()->greaterThanOrEqualTo($expiryTime)) {
            // Refresh the access token
            $client->refreshToken($user->google_refresh_token);
            $newAccessToken = $client->getAccessToken();

            // Update user's token and expiry in the database
            $user->update([
                'google_access_token' => $newAccessToken['access_token'],
                'google_token_expiry' => Carbon::now()->addSeconds($newAccessToken['expires_in']),
            ]);

            $accessToken = $newAccessToken['access_token'];
        }

        // Set the refreshed access token in the client
        $client->setAccessToken($accessToken);

        // Initialize Google Docs Service
        $docsService = new GoogleDocs($client);

        // Define the title of the new document
        $document = new GoogleDocs\Document([
            'title' => 'New Document Created via API'
        ]);

        // Create the document
        $createdDocument = $docsService->documents->create($document);

        return response()->json([
            'documentId' => $createdDocument->documentId,
            'title' => $createdDocument->title,
            'url' => 'https://docs.google.com/document/d/' . $createdDocument->documentId,
        ]);
    }

    
}
