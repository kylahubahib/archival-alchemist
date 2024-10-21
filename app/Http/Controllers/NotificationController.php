<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class NotificationController extends Controller
{
    public function getNotifications()
    {
        $userId = Auth::id();
        
        $notifications = Notification::where('notifiable_id', $userId)
        ->orderBy('created_at', 'desc')
        ->get();
    

        Log::info($notifications);

        $notificationData = [];

        foreach ($notifications as $notification) {
            $data = $notification->data;
    
            $notificationData[] = [
                'data' =>  $data,
                'read_at' =>  $notification->read_at,
                'created_at' =>  $notification->created_at,
            ];
           
        }
        
        Log::info($notificationData);

        return response()->json([
            'notificationData' => $notificationData
        ]);
    }

    
}
