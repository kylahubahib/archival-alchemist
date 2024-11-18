<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('superadmin-notifications', function () {
    $user = Auth::user();

    return $user && $user->user_type === 'superadmin';
});

Broadcast::channel('admin-notifications.{id}', function ($user, $id) {
    // $user = Auth::user();

    // return $user && $user->user_type === 'admin';
    return $user && $user->user_type === 'admin' && $user->id === (int) $id;
});

// Broadcast::channel('user-notifications.{id}', function ($id) {
//     $user = Auth::user();

//     return $user && ($user->user_type === 'teacher' || $user->user_type === 'student');
// });

Broadcast::channel('user-notifications.{id}', function ($user, $id) {

    return $user && ($user->user_type === 'teacher' || $user->user_type === 'student') && $user->id === (int) $id;
});


