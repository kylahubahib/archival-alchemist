<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
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

        $today = Carbon::today();
        $threeDaysBefore = Carbon::today()->addDays(3);

        $users = User::with([
            'personal_subscription',
            'institution_admin.institution_subscription'
        ])->select('id', 'name', 'is_premium')->get();

        foreach ($users as $user) {
            // Personal Subscription
            if ($user->personal_subscription) {
                $this->processPersonalSubscription($user, $today, $threeDaysBefore);
            }

            // Institutional Subscription
            if ($user->institution_admin && $user->institution_admin->institution_subscription) {
                $this->processInstitutionSubscription($user, $today, $threeDaysBefore);
            }
        }

        \Log::info('NotifySubscriptionExpiry command ended.');
        $this->info("Processed notifications for {$users->count()} users.");
        return 0;
    }

    private function processPersonalSubscription($user, $today, $threeDaysBefore)
    {
        $subscription = $user->personal_subscription;

        if ($subscription->end_date === $threeDaysBefore->toDateString()) {
            $user->notify(new UserNotification([
                'message' => 'Your personal subscription will expire in 3 days. Please renew it to avoid interruptions.',
                'user_id' => $user->id
            ]));
        }

        if ($subscription->end_date === $today->toDateString()) {
            $user->notify(new UserNotification([
                'message' => 'Your personal subscription expires today. Please renew to avoid service interruptions.',
                'user_id' => $user->id
            ]));
        }

        if (Carbon::parse($subscription->end_date)->isPast() && $subscription->persub_status !== 'Inactive') {
            $user->update(['is_premium' => 0]);
            $subscription->update(['persub_status' => 'Inactive']);
        }

        if ($subscription->persub_status === 'Inactive' && 
            (!$subscription->last_notified_at || $subscription->last_notified_at->diffInDays(Carbon::now()) >= 1)) {
            
            $user->notify(new UserNotification([
                'message' => 'Your personal subscription has expired. Please renew it to reactivate your account.',
                'user_id' => $user->id
            ]));

            $subscription->update(['last_notified_at' => Carbon::now()]);
        }
    }

    private function processInstitutionSubscription($user, $today, $threeDaysBefore)
    {
        $subscription = $user->institution_admin->institution_subscription;

        if ($subscription->end_date === $threeDaysBefore->toDateString()) {
            $user->notify(new InstitutionAdminNotification([
                'message' => 'Your institution\'s subscription will expire in 3 days. Please renew to avoid interruptions.',
                'user_id' => $user->id
            ]));
        }

        if ($subscription->end_date === $today->toDateString()) {
            $user->notify(new InstitutionAdminNotification([
                'message' => 'Your institution\'s subscription expires today. Please renew to continue the service.',
                'user_id' => $user->id
            ]));
        }

        if (Carbon::parse($subscription->end_date)->isPast() && $subscription->insub_status !== 'Inactive') {
            $user->update(['is_premium' => 0]);
            $subscription->update(['insub_status' => 'Inactive']);
        }

        if ($subscription->insub_status === 'Inactive' && 
            (!$subscription->last_notified_at || $subscription->last_notified_at->diffInDays(Carbon::now()) >= 1)) {
            
            $user->notify(new InstitutionAdminNotification([
                'message' => 'Your institution\'s subscription has expired. Please renew it to reactivate your services.',
                'user_id' => $user->id
            ]));

            $subscription->update(['last_notified_at' => Carbon::now()]);
        }
    }
}
