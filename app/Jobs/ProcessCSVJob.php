<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;
use App\Notifications\UserNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;


class ProcessCSVJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $userId;
    protected $filePath;
    
    public function __construct($userId, $filePath)
    {
        $this->userId = $userId;
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Job userId: ', [$this->userId]);

        $user = User::find($this->userId);

        if (!$user) {
            Log::error('User not found: ' . $this->userId);
            return; // Exit if user is not found
        }


        try {
            // Notify the user that processing has started
            $user->notify(new UserNotification([
                'user_id' => $user->id,
                'title' => 'CSV Import Started',
                'message' => 'Your CSV import is being processed.',
                'type' => 'info',
                'timestamp' => now(),
            ]));
    
            // Process the CSV
            Excel::import(new UsersImport($user->id), public_path($this->filePath));
    
            // Notify the user of successful completion
            $user->notify(new UserNotification([
                'user_id' => $user->id,
                'title' => 'CSV Import Completed',
                'message' => 'Your CSV import has been successfully completed.',
                'type' => 'success',
                'timestamp' => now(),
            ]));
        } catch (\Exception $e) {
            // Notify the user of failure
            $user->notify(new UserNotification([
                'user_id' => $user->id,
                'title' => 'CSV Import Failed',
                'message' => 'There was an error processing your CSV: ' . $e->getMessage(),
                'type' => 'error',
                'timestamp' => now(),
            ]));
    
            throw $e; // Rethrow the exception for logging
        }

        Log::info('Ending csv processing...');
    }
}
