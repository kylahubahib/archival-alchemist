<?php

namespace App\Http\Controllers;


use App\Models\InstitutionSubscription;
use App\Models\PersonalSubscription;
use App\Models\SubscriptionPlan;
use App\Models\InstitutionAdmin;
use App\Models\Transaction;
use App\Models\User;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Exception;


class PaymentSessionController extends Controller
{

    public function PaymentSession(Request $request)
    {
        //\Log::info('in payment session');
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $user = Auth::user();

        // \Log::info('User Info:', $user->toArray());

        $price = $plan->plan_price;
        $discount = $plan->plan_discount;

        //Check if there's a discount
        if ($discount !== null && $discount != 0.00) {
            $finalAmount = $price - ($price * $discount);
        } else {
            $finalAmount = $price;
        }


        try {
            $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'amount' => $finalAmount * 100,
                            'currency' => 'PHP',
                            'description' => 'Payment for ' . $plan->plan_name,
                            'billing' => [
                                'name' => $user->name,
                                'email' => $user->email,
                                'phone' => $user->user_pnum,
                            ],
                            'line_items' => [
                                [
                                    'name' => $plan->plan_name,
                                    'amount' => $plan->plan_price * 100,
                                    'currency' => 'PHP',
                                    'description' =>$plan->plan_text,
                                    'quantity' => 1,
                                ]
                            ],
                            'payment_method_types' => [
                                'gcash',
                                'card',
                                'paymaya',
                                'grab_pay',
                            ],
                            //'send_email_receipt' => false,
                            'success_url' => url('/payment/success'),
                            'cancel_url' => url('/payment/cancel'),

                        ],
                    ],
                ]);

            if ($response->successful()) {

                $checkout_id = $response->json('data.id');

                //Store checkout_id temporarily so that we can use it in paymentSuccess
                $request->session()->put('checkout_id', $checkout_id);

                $institution = InstitutionAdmin::where('user_id', $user->id)
                    ->first();

                if($institution) {
                    $request->session()->put('ins_sub_id', $institution->insub_id);
                }

                $request->session()->put('plan', $plan);
                $request->session()->put('finalAmount', $finalAmount);


                $checkoutUrl = $response->json('data.attributes.checkout_url');
                return response()->json(['checkout_url' => $checkoutUrl]);

            } else {
                return response()->json(['error' => 'Failed to create checkout session'], 500);
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'Payment gateway error: ' . $e->getMessage()], 500);
        }
    }

    public function paymentSuccess(Request $request){

        $checkoutId = $request->session()->get('checkout_id');
        $insub_id = $request->session()->get('ins_sub_id');
        $plan = $request->session()->get('plan');
        $finalAmount = $request->session()->get('finalAmount');
        
        $user = Auth::user();

        \Log::info('Checkout session id:'. $checkoutId);

        try {

            $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->get('https://api.paymongo.com/v1/checkout_sessions/' . $checkoutId);

            if ($response->successful()) {

                $checkoutDetails = $response->json('data.attributes');

                \Log::info('Checkout Details: ', $checkoutDetails);

                $subscriptionInterval = $plan->plan_term;
                $currentDate = Carbon::now();

                \Log::info('Start Date' . $currentDate);
                \Log::info($subscriptionInterval);

                if ($subscriptionInterval === 'monthly') {
                    $endDate = $currentDate->copy()->addMonth();

                } elseif ($subscriptionInterval === 'yearly') {
                    $endDate = $currentDate->copy()->addYear();

                } else {
                    // Handle other intervals or default behavior
                    $endDate = $currentDate;
                }

                \Log::info('End Date: '. $endDate);

                    $referenceNumber = $checkoutDetails['payments'][0]['id'] ?? null;
                    $status = $checkoutDetails['payments'][0]['attributes']['status'] ?? null;

                    //Create the transaction if payment is successful
                    $transaction = Transaction::create([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'checkout_id' => $checkoutId,
                        'reference_number' =>  $referenceNumber,
                        'trans_amount' => $finalAmount,
                        'trans_status' => $status,
                        'payment_method' => $checkoutDetails['payment_method_used'],
                    ]);

                    if($user->user_type === 'admin') {

                        $institutionSubscription = InstitutionSubscription::find($insub_id);

                        //Updates the subscription plan
                        $institutionSubscription->update([
                            'plan_id' => $plan->id,
                            'insub_status' => 'Active',
                            'total_amount' => $finalAmount,
                            'insub_content' => $institutionSubscription->insub_content,
                            'insub_num_user' => $plan->plan_user_num,
                            'start_date' => $currentDate->toDateString(),
                            'end_date' => $endDate,
                            'notify_renewal' => 1
                        ]);

                    } else {
                        $persubExist = PersonalSubscription::where('user_id', $user->id)->first();

                        if($persubExist)
                        {
                            $persubExist->update([
                                'plan_id' => $plan->id,
                                'persub_status' => 'Active',
                                'total_amount' => $finalAmount,
                                'start_date' => $currentDate->toDateString(),
                                'end_date' => $endDate,
                                'notify_renewal' => 1
                            ]);
                        }
                        else 
                        {
                            $personalSubscription = PersonalSubscription::create([
                                'user_id' => $user->id,
                                'plan_id' => $plan->id,
                                'persub_status' => 'Active',
                                'total_amount' => $finalAmount,
                                'start_date' => $currentDate->toDateString(),
                                'end_date' => $endDate,
                                'notify_renewal' => 1
                            ]);
                        }
                       
                    }
                    
                    //Updates user is_premium status
                    $user->update([
                        'is_premium' => 1
                    ]);

                    return redirect()->back();

                
            } else {
                return response()->json(['error' => 'Failed to retrieve checkout session'], 500);
            }

        } catch (Exception $e) {
            return response()->json(['error' => 'Error retrieving checkout session: ' . $e->getMessage()], 500);
        }



    }

    public function paymentCancel(Request $request)
    {

        //Maybe add some logic here where the checkout session is expired
        return redirect()->back();
    }


}
