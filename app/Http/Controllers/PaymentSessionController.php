<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;
use Luigel\Paymongo\Facades\Paymongo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Exception;


class PaymentSessionController extends Controller
{
    public function PaymentSession(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);
    
        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $user = Auth::user();
    
        try {
            $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'amount' => $plan->plan_price * 100, 
                            'currency' => 'PHP',
                            'description' => 'Payment for ' . $plan->plan_name,
                            'billing' => [
                                'name' => $user->name,
                                'email' => $user->email,
                                'phone' => $user->phone_number,
                            ],
                            'line_items' => [
                                [
                                    'name' => $plan->plan_name,
                                    'amount' => $plan->plan_price * 100,
                                    'currency' => 'PHP',
                                    'quantity' => 1,
                                ]
                            ],
                            'payment_method_types' => [
                                'gcash',
                                'card',
                                'paymaya',
                                'grab_pay',
                            ],
                            'success_url' => url('/pricing/payment/success'),
                            'cancel_url' => url('/pricing'),
                        ],
                    ],
                ]);
    
            // Check if the checkout session was successfully created
            if ($response->successful()) {

                $checkout_id = $response->json('data.id');
                // Redirect the user to the checkout URL of paymongo
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
        
        //Code para ibutang na ang user sa personal subscription
    }

    public function paymentCancel(Request $request){
        try {
            $checkout_id = $request->session()->get('checkout_id');
            $checkout = Paymongo::checkout()->find($checkout_id);
            // $transaction = Transaction::find($checkout->reference_number);
            // $transaction->delete();
            return to_route('home');
        } catch (\Throwable $th) {
            $request->session()->forget('checkout_id');
            return to_route('home');
        }
    }


}
