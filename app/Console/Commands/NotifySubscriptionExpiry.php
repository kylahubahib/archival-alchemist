<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\InstitutionSubscription;
use App\Models\PersonalSubscription;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

use App\Notifications\UserNotification;
use App\Notifications\InstitutionAdminNotification;

class NotifySubscriptionExpiry extends Command
{

    protected $signature = 'notify:subscription-expiry';

    protected $description = 'Notify users about their subscription expiration';

    public function __construct()
    {
        parent::__construct();
    }


    public function handle()
    {
        \Log::info('NotifySubscriptionExpiry command started.');
        // Get today's date and 3 days before
        $today = Carbon::today();
        $threeDaysBefore = Carbon::today()->addDays(3);

        $users = User::with([
            'personal_subscription:id,user_id,end_date,persub_status', 
            'institution_admin:id,user_id',
            'institution_admin.institution_subscription:id,insub_status,end_date'
        ])
        ->select('id', 'name', 'is_premium') 
        ->get();
    
        $users = User::with(['personal_subscription', 'institution_admin.institution_subscription'])->get();
    
        foreach ($users as $user) {
            // Check personal subscriptions
            if ($user->personal_subscription) {
                $subscription = $user->personal_subscription;
                $subscriptionEndDate = Carbon::parse($subscription->end_date);
    
                // Notify 3 days before expiry
                if ($subscriptionEndDate->isSameDay($threeDaysBefore)) {
                    $user->notify(new UserNotification([
                        'message' => 'Your personal subscription will expire in 3 days. Please renew it to avoid interruptions.',
                        'user_id' => $user->id
                    ]));
                }
    
                // Notify on the day of expiry
                if ($subscriptionEndDate->isSameDay($today)) {
                    $user->notify(new UserNotification([
                        'message' => 'Your personal subscription expires today. Please renew to avoid service interruptions.',
                        'user_id' => $user->id
                    ]));
                }
    
                // If the subscription has expired, mark it as inactive and notify the user daily to renew
                if ($subscriptionEndDate->isPast() && $subscription->persub_status !== 'Inactive') {

                    $user->update(['is_premium' => 0]);
                    // Update the subscription status to inactive
                    $subscription->update(['persub_status' => 'Inactive']);
                }
    
                // Notify daily for inactive subscriptions
                if ($subscription->persub_status === 'Inactive') {
                    $user->notify(new UserNotification([
                        'message' => 'Your personal subscription has expired. Please renew it to reactivate your account.',
                        'user_id' => $user->id
                    ]));
                }
            }
    
            // Check institutional subscriptions (if the user is an admin)
            if ($user->institution_admin && $user->institution_admin->institution_subscription) {
                $subscription = $user->institution_admin->institution_subscription;
                $subscriptionEndDate = Carbon::parse($subscription->end_date);
    
                // Notify 3 days before expiry
                if ($subscriptionEndDate->isSameDay($threeDaysBefore)) {
                    $user->notify(new InstitutionAdminNotification([
                        'message' => 'Your institution\'s subscription will expire in 3 days. Please renew to avoid interruptions.',
                        'user_id' => $user->id
                    ]));
                }
    
                // Notify on the day of expiry
                if ($subscriptionEndDate->isSameDay($today)) {
                    $user->notify(new InstitutionAdminNotification([
                        'message' => 'Your institution\'s subscription expires today. Please renew to continue the service.',
                        'user_id' => $user->id
                    ]));
                }
    
                // If the subscription has expired, mark it as inactive and notify the admin daily to renew
                if ($subscriptionEndDate->isPast() && $subscription->insub_status !== 'Inactive') {

                    $user->update(['is_premium' => 0]);
                    // Update the subscription status to inactive
                    $subscription->update(['insub_status' => 'Inactive']);
                }
    
                // Notify daily for inactive subscriptions
                if ($subscription->insub_status === 'Inactive') {
                    $user->notify(new InstitutionAdminNotification([
                        'message' => 'Your institution\'s subscription has expired. Please renew it to reactivate your services.',
                        'user_id' => $user->id
                    ]));
                }
            }
        }

        \Log::info('NotifySubscriptionExpiry command ended.');
    
        return 0;
    }
    

}
