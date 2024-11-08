<?php

namespace App\Http\Controllers;


use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

use App\Models\Transaction;
use App\Models\CustomContent;
use App\Models\InstitutionAdmin;
use App\Models\InstitutionSubscription;

use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;

class InstitutionSubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $ins_admin = $user->institution_admin; 

        if($ins_admin){
            $ins_sub = InstitutionSubscription::with(['plan', 'university_branch.university'])
                ->where('id', $ins_admin->institution_subscription->id)
                ->first();
        }

        $agreement = CustomContent::where('content_type', 'billing agreement')->first();
        $transactionHistory = Transaction::with(['user', 'plan'])
            ->where('user_id', $user->id)
            ->get();
        
        \Log::info('Institution Subscription', $ins_sub->toArray());

        return Inertia::render('InstitutionAdmin/SubscriptionBilling/SubscriptionBilling', [
            'ins_sub' => $ins_sub,
            'agreement' => $agreement,
            'transactionHistory' => $transactionHistory
        ]);
    }

    // public function uploadCSV(Request $request) 
    // {
    //     $file = $request->file('file'); 
    //     $insubId = $request->get('insubId');
    //     $university = $request->get('university');

    //     $fileName = $university . '_' . time() . '.' . $file->getClientOriginalExtension(); 
    //     $file->move(public_path('storage/csv_files'), $fileName);

    //     $ins_sub = InstitutionSubscription::find($insubId);

    //     $ins_sub->update([
    //         'insub_content' => 'storage/csv_files/' . $fileName,
    //     ]);

    //     return redirect(route('institution-subscription-billing.index'))->with('success', 'Successfully uploaded.');
    // }


    public function uploadCSV(Request $request) 
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
            'insubId' => 'required|exists:institution_subscriptions,id', 
            'university' => 'required|string|max:255', 
        ]);

        $file = $request->file('file'); 
        $insubId = $request->get('insubId');
        $university = $request->get('university');

        // Generate a unique filename
        $fileName = $university . '_' . time() . '.' . $file->getClientOriginalExtension(); 
        $file->move(public_path('storage/csv_files'), $fileName);

        $ins_sub = InstitutionSubscription::find($insubId);

        // Update the subscription record with the new file path
        $ins_sub->update([
            'insub_content' => 'storage/csv_files/' . $fileName,
        ]);

        try {
            $createAccounts = Excel::import(new UsersImport, public_path($ins_sub->insub_content));
            \Log::info('Import user successfully!');
        } catch (Exception $e) {
            \Log::error('Error during user import: ' . $e->getMessage());
        }

       

        return response()->json([
            'success' => true,
            'redirect_url' => route('institution-subscription-billing.index'),
            'message' => 'Successfully uploaded.',
            'file' => $ins_sub->insub_content
        ]);
    }


    public function readCSV(Request $request)
    {

        $filePath = $request->query('filePath');

        //\Log::info($filePath);

        //Check first if the file exist or not
        if (!file_exists(public_path($filePath))) {
            return response()->json(['success' => false, 'message' => 'File not found'], 404);
        }

        //Excel::toArray purpose is to read the contents of an Excel or CSV file and convert it into an array format. 
        $csvData = Excel::toArray(new UsersImport, public_path($filePath));

        // \Log::info('CSV Data:', $csvData[0]);


        return response()->json([
            'success' => true,
            'csvData' => $csvData[0], 
        ]);
    }


    public function cancelSubscription(Request $request)
    {
        //If user cancel their subscription, they won't be notify to renew their subscription since
        //subscription is non recurring

        $id = $request->get('id');

        $ins_sub = InstitutionSubscription::find($id);

        if($ins_sub->notify_renewal === 1)
        {
            $ins_sub->update([
                'notify_renewal' => 0
            ]);

            $message = "You have canceled your subscription.";
        }
        else 
        {
            $message = "You've already canceled your subscription";
        }

        
        return response()->json([
            'message' => $message
        ]);
    }

    
    public function renewSubscription(Request $request, string $id)
    {
        
    }

}
