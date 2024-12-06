<?php

namespace App\Observers;

use App\Models\AdminRegistrationToken;

class AdminRegistrationTokenObserver
{
    /**
     * Handle the AdminRegistrationToken "created" event.
     */
    public function created(AdminRegistrationToken $adminRegistrationToken): void
    {
        //
    }

    /**
     * Handle the AdminRegistrationToken "updated" event.
     */
    public function updated(AdminRegistrationToken $adminRegistrationToken): void
    {
        \Log::info('Token updated:', [
            'used' => $adminRegistrationToken->used,
            'expires_at' => $adminRegistrationToken->expires_at,
            'current_time' => now(),
        ]);

        // Delete the token if it's used or expired
        if ($adminRegistrationToken->used || $adminRegistrationToken->expires_at <= now()) {
            $adminRegistrationToken->delete();
        }
    }

    /**
     * Handle the AdminRegistrationToken "deleted" event.
     */
    public function deleted(AdminRegistrationToken $adminRegistrationToken): void
    {
        //
    }

    /**
     * Handle the AdminRegistrationToken "restored" event.
     */
    public function restored(AdminRegistrationToken $adminRegistrationToken): void
    {
        //
    }

    /**
     * Handle the AdminRegistrationToken "force deleted" event.
     */
    public function forceDeleted(AdminRegistrationToken $adminRegistrationToken): void
    {
        //
    }
}
