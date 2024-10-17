<?php

namespace App\Http\Controllers;

use App\Services\GoogleService;
use Illuminate\Http\Request;
use App\Traits\GoogleDriveTrait;

class GoogleDocsController extends Controller
{
    protected $googleService;

    public function __construct(GoogleService $googleService)
    {
        $this->googleService = $googleService;
    }

    /**
     * Redirect to Google authentication page
     */
    public function redirectToGoogle() 
    {
        return redirect($this->googleService->getAuthUrl());
    }

    /**
     * Handle the callback from Google
     */
    public function handleGoogleCallback(Request $request) 
    {
        // Check if there is an error in the callback
        if ($request->has('error')) {
            // Handle the error (e.g., log it, redirect with a message)
            return redirect('/error')->with('error', 'Google authentication failed.');
        }

        // Get the authorization code from the request
        $code = $request->get('code');

        try {
            // Handle the OAuth callback and store the access token
            $this->googleService->handleOAuthCallback($code);
            return redirect('/library'); // Redirect to your desired route after successful authentication
        } catch (\Exception $e) {
            // Handle exceptions (e.g., log the error, redirect with a message)
            return redirect('/error')->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    use GoogleDriveTrait;

    public function getGoogleDocLinkAPI($fileId)
    {
        // Use the trait method to generate the Google Docs link
        $docLink = $this->getGoogleDocLink($fileId);

        // Return the link as a JSON response for the React frontend
        return response()->json(['doc_link' => $docLink]);
    }
    
    
}
