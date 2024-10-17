<?php

namespace App\Traits;

use App\Services\GoogleService;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;

trait GoogleDriveTrait
{
    // This method assumes you have a method for getting the Google client
    public function uploadDocumentToDrive($filePath)
    {
        $client = $this->getGoogleClient();  // Assuming getGoogleClient exists
        $client->setAccessToken(session('google_access_token'));

        $service = new Google_Service_Drive($client);
        $fileMetadata = new Google_Service_Drive_DriveFile([
            'name' => 'UploadedDocument',
            'mimeType' => 'application/vnd.google-apps.document',  // Google Docs format
        ]);

        $content = file_get_contents($filePath);
        $file = $service->files->create($fileMetadata, [
            'data' => $content,
            'mimeType' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'uploadType' => 'multipart',
            'fields' => 'id',
        ]);

        return $file->id;  
    }

    // Example of getGoogleClient method (add if needed)
    public function getGoogleClient()
    {
        // Ensure you have this logic somewhere
        return app()->make('App\Services\GoogleService')->getClient();  // Adjust according to your structure
    }

    public function getGoogleDocLink($fileId)
    {
        return "https://docs.google.com/document/d/$fileId/edit";
    }
}
