<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Models\Feature;
use App\Models\PlanFeature;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscriptionPlans = SubscriptionPlan::paginate(100);
        $features = Feature::all();
        $planFeatures = PlanFeature::with(['plan', 'feature'])->get();

        //\Log::info('Plans ', $subscriptionPlans->toArray());


        return Inertia::render('SuperAdmin/SubscriptionPlans/SubscriptionPlans', [
            'subscriptionPlans' => $subscriptionPlans,
            'features' => $features,
            'planFeatures' => $planFeatures
        ]);
    }

    /**
     * Display the available subscription plans in the pricing page.
     * This is a custom method in the controller.
     * You must create a route in web.php if you want to add a custom method.
     */
    public function pricing()
    {
        $personalPlans = SubscriptionPlan::where('plan_status', 'available')
            ->where('plan_type', 'Personal')
            ->get();

        $institutionalPlans = SubscriptionPlan::where('plan_status', 'available')
            ->where('plan_type', 'Institutional')
            ->get();

        $planFeatures = PlanFeature::with(['plan', 'feature'])->get();


        return Inertia::render('Pricing', [
            'personalPlans' => $personalPlans,
            'institutionalPlans' => $institutionalPlans,
            'planFeatures' => $planFeatures
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //return Inertia::render('SuperAdmin/SubscriptionPlan/SubscriptionPlan');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Create request data: ', $request->all());

        $request->validate([
            'plan_name' => 'required|string|max:255|unique:subscription_plans',
            'plan_price' => 'required|numeric|between:0,99999.99',
            'plan_term' => 'required|string|max:255',
            'plan_type' => 'required|string|max:255',
            'plan_user_num' => 'nullable|integer|min:0',
            'plan_discount' => 'nullable|numeric|between:0,99.99',
            'free_trial_days' => 'nullable|integer|min:0',
            'plan_text' => 'required|string',
        ]);

        //Convert percentage discount in decimal
        if ($request->plan_discount !== null && $request->plan_discount != 0.00) {
            $discount = $request->plan_discount/100;
        } else {
            $discount = $request->plan_discount;
        }

        $plan = SubscriptionPlan::create([
            'plan_name' => $request->plan_name,
            'plan_price' => $request->plan_price,
            'plan_term' => $request->plan_term,
            'plan_type' => $request->plan_type,
            'plan_user_num' => $request->plan_user_num,
            'plan_discount' => $discount,
            'free_trial_days' => $request->free_trial_days,
            'plan_text'=> $request->plan_text,
            'plan_status' => 'Available',
        ]);

        foreach ($request->plan_features as $featureId) {
            PlanFeature::create([
                'plan_id' => $plan->id,
                'feature_id' => $featureId,
            ]);
        }
        
        //\Log::info('Plan created:', ['plan_id' => $plan->id]);


        //return redirect(route('subscription-plans'))->with('success', 'Subscription Plans created successfully.');
        return redirect(route('manage-subscription-plans.index'))->with('success', 'Subscription Plans created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SubscriptionPlan $subscriptionPlan)
    {
        $planFeatures = PlanFeature::where('plan_id', $subscriptionPlan->id)
            ->with(['plan', 'feature'])
            ->get();

        return Inertia::render('SuperAdmin/SubscriptionPlan/Show', [
            'subscriptionPlan' => $subscriptionPlan,
            'planFeatures' => $planFeatures
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubscriptionPlan $subscriptionPlan)
    {
        $planFeatures = PlanFeature::where('plan_id', $subscriptionPlan->id)
            ->with(['plan', 'feature'])
            ->get();

        return Inertia::render('SuperAdmin/SubscriptionPlan/Edit', [
            'subscriptionPlan' => $subscriptionPlan,
            'planFeatures' => $planFeatures
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'plan_name' => 'required|string|max:255',
            'plan_price' => 'required|numeric|between:0,99999.99',
            'plan_term' => 'required|string|max:255',
            'plan_type' => 'required|string|max:255',
            'plan_user_num' => 'nullable|integer|min:0',
            'plan_discount' => 'nullable|numeric|between:0,99.99',
            'free_trial_days' => 'nullable|integer|min:0',
            'plan_text' => 'required|string',
        ]);

        $subscriptionPlan = SubscriptionPlan::findOrFail($id);

        $subscriptionPlan->update([
            'plan_name' => $request->plan_name,
            'plan_price' => $request->plan_price,
            'plan_term' => $request->plan_term,
            'plan_type' => $request->plan_type,
            'plan_user_num' => $request->plan_user_num,
            'plan_discount' => $request->plan_discount,
            'free_trial_days' => $request->free_trial_days,
            'plan_text'=> $request->plan_text,
            'plan_status' => 'Available',
        ]);

        PlanFeature::where('plan_id', $subscriptionPlan->id)->delete();

        foreach ($request->plan_features as $featureId) {
            PlanFeature::create([
                'plan_id' => $subscriptionPlan->id,
                'feature_id' => $featureId,
            ]);
        }

        return redirect(route('manage-subscription-plans.index'))->with('success', 'Subscription Plan updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $subscriptionPlan = SubscriptionPlan::findOrFail($id);
        $subscriptionPlan->delete();

        return redirect(route('manage-subscription-plans.index'))->with('success', 'Subscription Plan deleted successfully.');
    }

    public function change_status(Request $request, $id): RedirectResponse
    {
        $plan = SubscriptionPlan::findOrFail($id);



        if($plan->plan_status === 'Unavailable'){
            $plan->update([
                'plan_status' => 'Available',
            ]);
        }
        else if($plan->plan_status === 'Available'){
            $plan->update([
                'plan_status' => 'Unavailable',
            ]);
        }
        else {
            Log::info('Something went wrong');
        }



        return redirect(route('manage-subscription-plans.index'))->with('success', 'Terms and conditions deleted successfully.');
    }
}
