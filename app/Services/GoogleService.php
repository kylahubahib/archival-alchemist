<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Docs;

class GoogleService
{
    protected $client;

    public function __construct() 
    {
        $this->client = new Client();
        
        // Set client ID, secret, and redirect URI from environment variables
        $clientId = $this->client->setClientId(env('GOOGLE_CLIENT_ID'));
        $this->client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $this->client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));

        if (empty($clientId)) {
            throw new \Exception('Client ID is not set. Please check your .env file.');
        }
        
        // Add necessary Google Drive and Docs scopes
        $this->client->setScopes([
            Docs::DOCUMENTS,
            Drive::DRIVE_FILE,
        ]);
        
        // Request offline access to get refresh token
        $this->client->setAccessType('offline');
        
        // Prompt consent to ensure getting a refresh token or allow switching accounts
        $this->client->setPrompt('consent');
    }

    /**
     * Get the configured Google client
     * 
     * @return \Google\Client
     */
    public function getClient()
    {
        // Handle access token retrieval here if needed
        if (session()->has('google_access_token')) {
            $this->client->setAccessToken(session('google_access_token'));

            // Refresh the token if it has expired
            if ($this->client->isAccessTokenExpired()) {
                $refreshToken = session('google_refresh_token');
                if ($refreshToken) {
                    $this->client->fetchAccessTokenWithRefreshToken($refreshToken);
                    session(['google_access_token' => $this->client->getAccessToken()]);
                } else {
                    // Handle missing refresh token (optional)
                    // e.g., redirect to authentication process
                }
            }
        }
        
        return $this->client;
    }

    /**
     * Generate the authorization URL
     *
     * @return string
     */
    public function getAuthUrl()
    {
        return $this->client->createAuthUrl();
    }

    /**
     * Handle the OAuth callback and store the access token
     *
     * @param string $code
     * @return void
     */
    public function handleOAuthCallback($code)
    {
        // Exchange authorization code for access token
        $token = $this->client->fetchAccessTokenWithAuthCode($code);
        
        if (isset($token['error'])) {
            // Handle errors during the token exchange process
            // You can log the error or redirect as needed
            throw new \Exception('Error fetching access token: ' . $token['error']);
        }

        $this->storeAccessToken($token);
    }

    /**
     * Store the access token after OAuth callback
     * 
     * @param array $token
     * @return void
     */
    public function storeAccessToken($token)
    {
        // Store the access token and refresh token in the session
        session(['google_access_token' => $token['access_token']]);
        
        if (isset($token['refresh_token'])) {
            session(['google_refresh_token' => $token['refresh_token']]);
        }
    }
}
