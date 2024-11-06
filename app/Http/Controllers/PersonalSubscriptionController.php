<?php

namespace App\Http\Controllers;

use App\Models\PersonalSubscription;
use App\Models\CustomContent;
use App\Models\Transaction;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\User;

class PersonalSubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if($user){
            $per_sub = PersonalSubscription::with(['plan', 'user'])
                ->where('user_id', $user->id)
                ->where('persub_status', 'Active')
                ->first();

            $agreement = CustomContent::where('content_type', 'billing agreement')->first();
            $transactionHistory = Transaction::with(['user', 'plan'])
                ->where('user_id', $user->id)
                ->get();
        }
        
        \Log::info('Personal Subscription: ', $per_sub);

        if($per_sub){
            return response()->json([
                'per_sub' => $per_sub,
                'transactionHistory' => $transactionHistory,
                'agreement' => $agreement
            ]);
        }

        return response()->json([
            'agreement' => $agreement
        ]);
       
        //\Log::info('Persub: ', $per_sub->toArray());
        
       
    }


    public function cancelSubscription(Request $request, string $id)
    {
        //If user cancel their subscription, they won't be notified to renew their subscription since
        //subscription is non recurring

        $per_sub = PersonalSubscription::find($id);

        $per_sub->update([
            'notify_renewal' => 0
        ]);

        return redirect(route('user-subscription'))->with('success', 'You canceled your subscription');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
