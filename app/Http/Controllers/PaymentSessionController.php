<?php

namespace App\Http\Controllers;


use App\Models\InstitutionSubscription;
use App\Models\PersonalSubscription;
use App\Models\SubscriptionPlan;
use App\Models\InstitutionAdmin;
use App\Models\Transaction;
use App\Models\User;


use App\Models\University;
use App\Models\UniversityBranch;

use App\Mail\AccountCredentialsMail;
use Illuminate\Support\Facades\Mail;


use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;
use Exception;


use App\Notifications\SuperadminNotification;

class PaymentSessionController extends Controller
{

    public function PaymentSession(Request $request)
    {
        //\Log::info('in payment session');
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        // $price = $request->get('total_amount');
        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $num_user = $request->num_user;
        $user = Auth::user();

        // \Log::info('User Info:', $user->toArray());

        $price = $plan->plan_price * $request->num_user;
        $discount = $plan->plan_discount;

        //Check if there's a discount
        if ($discount !== null && $discount != 0.00) {
            $finalAmount = $price - ($price * $discount);
        } else {
            $finalAmount = $price;
        }


        try {
            // $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
            $response = Http::withBasicAuth('sk_test_fe8EN9GYV7cY9PmjnjV8D3hp', '')
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
                                    'amount' => $price * 100,
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
                            'send_email_receipt' => true,
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
                $request->session()->put('num_user', $num_user);


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
        $plan = $request->session()->get('plan');
        $finalAmount = $request->session()->get('finalAmount');
        $userInfo = $request->session()->get('userInfo');
        $insub_id = $request->session()->get('ins_sub_id');
        $num_user =  $request->session()->get('num_user');
        
        $user = Auth::user();

        \Log::info('Checkout session id:'. $checkoutId);

        // dd($request->session()->all());

        if($user) 
        {

            try {

                // $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
                $response = Http::withBasicAuth('sk_test_fe8EN9GYV7cY9PmjnjV8D3hp', '')
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

                        if($user->user_type === 'institution_admin') {

                            $institutionSubscription = InstitutionSubscription::find($insub_id);

                            //Updates the subscription plan
                            $institutionSubscription->update([
                                'plan_id' => $plan->id,
                                'insub_status' => 'Active',
                                'total_amount' => $finalAmount,
                                'insub_content' => $institutionSubscription->insub_content,
                                'insub_num_user' => $num_user,
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

        else {

            $password = Str::random(8);

            $user = User::create([
                'name' => $userInfo['name'],
                'email' => $userInfo['email'],
                'password' => Hash::make($password),
                'user_type' => 'institution_admin', 
                'user_pic' => 'storage/profile_pics/default_pic.png',
                'user_status' => 'Active',
                'is_premium' => 0,
                'is_affiliated' => 0,
                'user_pnum' => $userInfo['pnum']
            ]);

            \Log::info('User created:', $user->toArray());
            \Log::info('User password:', (array)$password);
    
            try {

                $response = Http::withBasicAuth('sk_test_fe8EN9GYV7cY9PmjnjV8D3hp', '')
                    ->get('https://api.paymongo.com/v1/checkout_sessions/' . $checkoutId);

                if ($response->successful()) {

                    $checkoutDetails = $response->json('data.attributes');

                    \Log::info('Checkout Details: ', $checkoutDetails);

                    $subscriptionInterval = $plan['plan_term'];
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
                            'plan_id' => $plan['id'],
                            'checkout_id' => $checkoutId,
                            'reference_number' =>  $referenceNumber,
                            'trans_amount' => $finalAmount,
                            'trans_status' => $status,
                            'payment_method' => $checkoutDetails['payment_method_used'],
                        ]);

                        $institutionSubscription = InstitutionSubscription::create([
                            'uni_branch_id' => $userInfo['uni_branch_id'],
                            'plan_id' => $plan['id'],
                            'insub_status' => 'Active',
                            'total_amount' => $userInfo['total_amount'],
                            'insub_content' => null,
                            'insub_num_user' => $userInfo['number_of_users'],
                            'start_date' => $currentDate->toDateString(),
                            'end_date' => $endDate,
                            'notify_renewal' => 1
                        ]);
            
                        \Log::info('Ins Subscription created:', $institutionSubscription->toArray());
                        
                        //Updates user is_premium status
                        $user->update([
                            'is_premium' => 1
                        ]);
            
                        $institutionAdmin = InstitutionAdmin::create([
                            'user_id' => $user->id,
                            'insub_id' => $institutionSubscription->id,
                            'ins_admin_proof' => 'storage/admin_proof_files/' . $userInfo['fileName']
                        ]);
            
                        \Log::info('Institution Admin created:', ['ins_admin_id' => $institutionAdmin->id]);
            
                        if($institutionAdmin)
                        {
                           
                            $superadmins = User::where('user_type', 'superadmin')->get();
            
                            //Notify the superadmin for the newly registered institution admin
                            if ($superadmins->isNotEmpty()) {
                                foreach ($superadmins as $superadmin) {
                                    $superadmin->notify(new SuperadminNotification([
                                        'message' => 'A new institution admin has registered and sent proof for validation',
                                        'admin_id' => $superadmin->id,
                                        'proof_url' => $institutionAdmin->ins_admin_proof,
                                    ]));
                                }
                            }

                            Mail::to($user->email)->send(new AccountCredentialsMail([
                                'name' => $user->name,
                                'email' => $user->email,
                                'password' => $password,
                                'message' => 'Thank you for your subscription! We are excited to welcome your institution to Archival Alchemist! 
                                With your admin account, you can manage institution-wide capstone projects securely and efficiently.'
                            ]));

                            // Log the user in
                            Auth::login($user);

                            // Regenerate the session
                            $request->session()->regenerate();

                            return redirect()->route('institution-students');
                        }    

                        // return redirect()->back();

                    
                } else {
                    return response()->json(['error' => 'Failed to retrieve checkout session'], 500);
                }

            } catch (Exception $e) {
                return response()->json(['error' => 'Error retrieving checkout session: ' . $e->getMessage()], 500);
            }
        }


    }

    public function paymentCancel(Request $request)
    {

        //Maybe add some logic here where the checkout session is expired
        return redirect()->back();
    }

    public function registerInstitution(Request $request)
    {
        \Log::info('Registering Institution...');
    
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'university' => 'nullable|string|max:255',
            'campus' => 'nullable|string|max:255',
            'pnum' => 'nullable|string|max:11',
            'uni_branch_id' => 'nullable|integer',
            'number_of_users' => 'required|integer'
        ]);
    
        \Log::info($request->all());
        
        $file = $request->file('ins_admin_proof');
        $plan = $request->plan;
    
        \Log::info('Plan:', $plan);
    
        $uniExist = University::firstOrCreate(['uni_name' => $request->university]);

        $uniBranchExist = UniversityBranch::where('uni_id', $uniExist->id)
            ->where('uni_branch_name', $request->campus)
            ->first();
        
        if (!$uniBranchExist) {
            $uniBranch = UniversityBranch::create([
                'uni_id' => $uniExist->id,
                'uni_branch_name' => $request->campus,
            ]);
            \Log::info('New university branch created: ' . $uniBranch->uni_branch_name);
        } else {
            \Log::info('Existing university branch found: ' . $uniBranchExist->uni_branch_name);
        }
        
        
        if ($file) {
            \Log::info('File:', [
                'name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);
        
            // Generate a unique file name
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // Store the file in the 'admin_proof_files' directory
            //$file->storeAs('admin_proof_files', $fileName, 'public');
            
        } else {
            \Log::info('No file uploaded for ins_admin_proof.');
        }

        
        $price = $request->total_amount;
        $discount = $plan['plan_discount'];
    
        // Check if there's a discount
        if ($discount !== null && $discount != 0.00) {
            $finalAmount = $price - ($price * $discount);
        } else {
            $finalAmount = $price;
        }
        // dd('Test: ', env('TEST_VARIABLE'));


        // dd(env('PAYMONGO_SECRET_KEY'));

        // $response = Http::withBasicAuth(env('PAYMONGO_SECRET_KEY'), '')
        try {
            $response = Http::withBasicAuth('sk_test_fe8EN9GYV7cY9PmjnjV8D3hp', '')
                ->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'amount' => $finalAmount * 100,
                            'currency' => 'PHP',
                            'description' => 'Payment for ' . $plan['plan_name'],
                            'billing' => [
                                'name' => $request->name,
                                'email' => $request->email,
                                'phone' => $request->pnum,
                            ],
                            'line_items' => [
                                [
                                    'name' => $plan['plan_name'],
                                    'amount' => $finalAmount * 100, 
                                    'currency' => 'PHP',
                                    'description' => $plan['plan_text'],
                                    'quantity' => 1,
                                ]
                            ],
                            'payment_method_types' => [
                                'gcash',
                                'card',
                                'paymaya',
                                'grab_pay',
                            ],
                            'success_url' => url('/payment/success'),
                            'cancel_url' => url('/payment/cancel'),
                        ],
                    ],
                ]);
    
            if ($response->successful()) {

                $userInfo = ([
                    'name' => $request->name,
                    'email' => $request->email,
                    'uni_branch_id' => $uniBranchExist ? $uniBranchExist->id : $uniBranch->id,
                    'pnum' => $request->pnum,
                    'fileName' => $fileName,
                    'number_of_users' => $request->number_of_users,
                    'total_amount' => $price,
                ]);

                $request->session()->put('userInfo', $userInfo);
                
                \Log::info('User Info:', $userInfo);

    
                $checkout_id = $response->json('data.id');
    
                // Store checkout_id temporarily so that we can use it in paymentSuccess
                $request->session()->put('checkout_id', $checkout_id);
    
                $request->session()->put('plan', $plan);
                $request->session()->put('finalAmount', $finalAmount);

                 // Store the file in the 'admin_proof_files' directory
                 $file->storeAs('admin_proof_files', $fileName, 'public');
 
    
                $checkoutUrl = $response->json('data.attributes.checkout_url');
    
                // return response()->json([
                //     'checkout_url' => $checkoutUrl
                // ]);

                return Inertia::render('InstitutionSubForm', [
                    'checkout_url' => $checkoutUrl, 
                ]);
    
            } else {
                return response()->json(['error' => 'Failed to create checkout session'], 500);
            }
        } catch (Exception $e) {
            return Inertia::render('CheckoutUrl', [
                    'error' => 'Payment gateway error: ' . $e->getMessage()
                ]);
            //return response()->json(['error' => 'Payment gateway error: ' . $e->getMessage()], 500);
        }
    }
    
}
