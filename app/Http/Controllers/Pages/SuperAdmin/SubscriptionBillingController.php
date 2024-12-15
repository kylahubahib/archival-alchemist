<?php

namespace App\Http\Controllers\Pages\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CustomContent;
use App\Models\InstitutionSubscription;
use App\Models\PersonalSubscription;
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
            case 'personal':
                $query->with([
                    'transaction:id,user_id,plan_id,checkout_id,reference_number,trans_amount,payment_method,trans_status,created_at',
                    'personal_subscription:id,user_id,plan_id,persub_status,start_date,end_date,total_amount',
                    'personal_subscription.plan:id,plan_name,plan_term,plan_type',
                    // 'personal_subscription.subscription_history:id,sub_his_type,sub_his_activity',
                ]);
                break;
            case 'institutional':
                $query->with([
                    'transaction:id,user_id,plan_id,checkout_id,reference_number,trans_amount,payment_method,trans_status,created_at',
                    'institution_admin:id,user_id,insub_id',
                    'institution_admin.institution_subscription:id,plan_id,uni_branch_id,start_date,end_date,insub_num_user,insub_status',
                    'institution_admin.institution_subscription.plan:id,plan_name,plan_term,plan_type',
                    // 'institution_admin.institution_subscription.subscription_history:id,sub_his_type,sub_his_activity',
                    'institution_admin.institution_subscription.university_branch:id,uni_id,uni_branch_name',
                    'institution_admin.institution_subscription.university_branch.university:id,uni_name,uni_acronym',
                ]);
                break;
        }

        if (strtolower($subscriptionType) === 'personal') {
            $query->whereHas('personal_subscription.plan', function ($q) use ($subscriptionType) {
                $q->whereRaw('LOWER(plan_type) = ?', [strtolower($subscriptionType)]);
            });
        } else if (strtolower($subscriptionType) === 'institutional') {
            $query->whereHas('institution_admin.institution_subscription.plan', function ($q) use ($subscriptionType) {
                $q->whereRaw('LOWER(plan_type) = ?', [strtolower($subscriptionType)]);
            });
        }
        // Filters
        if ($searchValue) {
            $query->where(function ($q) use ($searchValue) {
                // Personal subscription filters
                $q->whereHas('personal_subscription.plan', function ($q) use ($searchValue) {
                    $q->where('plan_name', 'LIKE', '%' . $searchValue . '%');
                })
                    ->orWhereHas('personal_subscription', function ($q) use ($searchValue) {
                        $q->where('id', $searchValue);
                    })
                    ->orWhere('name', 'LIKE', '%' . $searchValue . '%');

                // Institutional subscription filters
                $q->orWhereHas('institution_admin.institution_subscription.plan', function ($q) use ($searchValue) {
                    $q->where('plan_name', 'LIKE', '%' . $searchValue . '%');
                })
                    ->orWhereHas('institution_admin.institution_subscription', function ($q) use ($searchValue) {
                        $q->where('id', $searchValue);
                    });
            });
        }

        $subscriptions = $query->latest()->paginate($entries);

        // Get statistics for personal subscriptions
        if (strtolower($subscriptionType) === 'personal') {
            $stats = [
                'total' => PersonalSubscription::count(),
                'active' => PersonalSubscription::where('persub_status', 'Active')->count(),
                'paused' => PersonalSubscription::where('persub_status', 'Paused')->count(),
                'expired' => PersonalSubscription::where('persub_status', 'Expired')->count(),
            ];
        } else {
            $stats = [
                'total' => InstitutionSubscription::count(),
                'active' => InstitutionSubscription::where('insub_status', 'Active')->count(),
                'paused' => InstitutionSubscription::where('insub_status', 'Paused')->count(),
                'expired' => InstitutionSubscription::where('insub_status', 'Expired')->count(),
            ];
        }

        $agreement = CustomContent::where('content_type', 'billing agreement')->first();

        $subscriptions = $query->latest()->paginate($entries);

        if (request()->expectsJson()) {
            return response()->json($subscriptions);
        }

        return Inertia::render('SuperAdmin/SubscriptionBilling/SubscriptionBilling', [
            'subscriptionType' => $subscriptionType,
            'subscriptions' => $subscriptions,
            'stats' => $stats,
            'agreement' => $agreement,
            'searchValue' => $searchValue,
        ]);
    }
}
