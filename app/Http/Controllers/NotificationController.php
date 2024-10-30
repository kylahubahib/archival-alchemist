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
use Carbon\Carbon;


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

        $unreadNotif = Notification::where('notifiable_id', $userId)
        ->where('read_at', null)->get();

        return response()->json([
            'notificationData' => $notificationData,
            'unreadNotif' => $unreadNotif
        ]);
    }


    public function markAsRead()
    {
        $userId = Auth::id();
    
        Notification::where('notifiable_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => Carbon::now()]);
    
        return response()->json(['message' => 'Notifications marked as read.']);
    }

    
    public function clearNotifications()
    {
        $userId = Auth::id();

        Notification::where('notifiable_id', $userId)->delete();

        return response()->json(['message' => 'Notifications cleared.']);
    }

    
}
