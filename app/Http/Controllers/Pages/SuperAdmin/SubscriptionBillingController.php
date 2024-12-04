<?php

namespace App\Http\Controllers\Pages\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionBillingController extends Controller
{
    public function index()
    {
        // Mail::to('mmpurposes1@gmail.com')->send(new AdminRegistrationMail());

        // Shows the students list as the page loads 
        return $this->filter('personal');
    }

    public function filter($subscriptionType)
    {

        $searchValue = request('search', null);
        $entries = request('entries', null);

        // Base query to get the users
        $query = User::select('id', 'name', 'email', 'is_premium', 'user_pic', 'created_at', 'user_status');

        switch ($subscriptionType) {
            case 'Personal':
                $query->with([
                    'personal_subscription:id,user_id,persub_status,start_date,end_date,total_amount,uni_branch_id',
                    'personal_subscription.plan:id,plan_id,plan_name,plan_term,plan_type',
                    'personal_subscription.subscription_history:id,sub_his_type,sub_his_activity',
                ]);
                break;
            case 'Institutional':
                $query->with([
                    'institution_admin:id,user_id',
                    'institution_admin.institution_subscription:id,uni_branch_id,start_date,end_date,insub_num_user,insub_status',
                    'institution_admin.institution_subscription.plan:id,plan_id,plan_name,plan_term,plan_type',
                    // 'institution_admin.institution_subscription.subscription_history:id,sub_his_type,sub_his_activity',
                    'institution_admin.institution_subscription.university_branch:id,uni_id,uni_branch_name',
                    'institution_admin.institution_subscription.university_branch.university:id,uni_name,uni_acronym',
                ]);
                break;
        }

        if ($subscriptionType === 'Personal') {
            $query->whereHas('personal_subscription.plan', function ($q) use ($subscriptionType) {
                $q->where('plan_type', $subscriptionType);
            });
        } else if ($subscriptionType === 'Institutional') {
            $query->whereHas('institution_admin.institution_subscription.plan', function ($q) use ($subscriptionType) {
                $q->where('plan_type', $subscriptionType);
            });
        }

        // Filters
        if ($searchValue) {
            $query->where(function ($q) use ($searchValue) {
                $q->where('name', 'LIKE', '%' . $searchValue . '%')
                    ->orWhere('id', $searchValue); // Use orWhere here
            });
        }

        $subscriptions = $query->latest()->paginate($entries);

        if (request()->expectsJson()) {
            return response()->json($subscriptions);
        }

        return Inertia::render('SuperAdmin/SubscriptionBilling/SubscriptionBilling', [
            'subscriptionType' => $subscriptionType,
            'subscriptions' => $subscriptions,
            'searchValue' => $searchValue,
        ]);
    }
}
