<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('superadmin-notifications', function () {
    $user = Auth::user();

    return $user && $user->user_type === 'superadmin';
});


