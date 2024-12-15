<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CustomContent;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use App\Notifications\InstitutionAdminNotification;
use App\Notifications\UserNotification;

class TermsAndConditionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //\Log::info('ok'); 

        $termsConditions = CustomContent::with('user')
            ->where('content_type', 'terms and conditions')
            ->paginate(100);
        
        $billingAgreement = CustomContent::with('user')
            ->where('content_type', 'billing agreement')
            ->first();

        $privacyPolicy = CustomContent::with('user')
            ->where('content_type', 'privacy policy')
            ->first();

        
            //\Log::info('Terms ', $termsConditions->toArray());


        return Inertia::render('SuperAdmin/TermsAndConditions/TermsCondition', [
            'termsConditions' => $termsConditions,
            'billingAgreement' => $billingAgreement,
            'privacyPolicy' => $privacyPolicy,
        ]);
    }

    public function getTermsAndConditions()
    {
        $terms = CustomContent::where('content_type', 'terms and conditions');

        return response()->json($terms);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/TermsAndConditions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'content_title' => 'required|string|max:1000',
            'content_text' => 'required|string',
        ], [], [
            'content_title' => 'title',
            'content_text' => 'text',
        ]);


        $data = CustomContent::create([
            'user_id' => Auth::id(),
            'content_type' => 'terms and conditions',
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'subject' => null,
        ]);


        if ($data) {
            $insAdmins = User::where('user_type', 'admin')->get();

            if ($insAdmins->isNotEmpty()) {
                foreach ($insAdmins as $admin) {
                    $admin->notify(new InstitutionAdminNotification([
                        'message' => 'We have updated our terms and conditions. Please review the changes in on our website.',
                        'user_id' => $admin->id
                    ]));
                }
            }

            $users = User::whereIn('user_type', ['student', 'teacher'])->get();

            if ($users->isNotEmpty()) {
                foreach ($users as $user) {
                    $user->notify(new UserNotification([
                        'message' => 'We have updated our terms and conditions. Please review the changes on our website.',
                        'user_id' => $user->id
                    ]));
                }
            }

            UserLog::create([
                'user_id' => Auth::id(),
                'log_activity' => 'Created terms and conditions',
                'log_activity_content' => "Created new terms and conditions entitled <strong>{$request->content_title}</strong>.",
            ]);
        }

        return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Terms and conditions created successfully.');
    }




    /**
     * Display the specified resource.
     */
    public function show(CustomContent $termsAndCondition): Response
    {

        return Inertia::render('SuperAdmin/TermsAndConditions/Show', [
            'termConditions' => $termsAndCondition,
        ]);
    }

    /**
     * If the above method didnt work try using this:
     * public function show($id): Response
     *{
     *    $termsConditions = CustomContent::find($id);
     *
     *   return Inertia::render('SuperAdmin/TermsAndConditions/Show', [
     *      'termConditions' => $termsAndCondition,
     *    ]);
     *}
     */


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomContent $termsAndCondition): Response
    {
        return Inertia::render('SuperAdmin/TermsAndConditions/Edit', [
            'termConditions' => $termsAndCondition->load('user'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        //\Log::info('Update request received for tc ID: ' . $id);
        //\Log::info('Update request data: ', $request->all());

        $request->validate([
            'content_title' => 'required|string|max:1000',
            'content_text' => 'required|string',
        ], [], [
            'content_title' => 'title',
            'content_text' => 'text',
        ]);

        $data = CustomContent::find($id);

        // Update content_title and content_text
        $data->update([
            'content_title' => $request->content_title,
            'content_text' => $request->content_text,
            'user_id' => Auth::id(),
        ]);

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Updated Content',
            'log_activity_content' => "Updated the {$data->content_type} entitled <strong>{$data->content_title}</strong>.",
        ]);

        if ($data->content_type === 'billing agreement') {
            $insAdmins = User::where('user_type', 'admin')->get();

            if ($insAdmins->isNotEmpty()) {
                foreach ($insAdmins as $admin) {
                    $admin->notify(new InstitutionAdminNotification([
                        'message' => 'We have updated our billing agreement. Please review the changes in your account settings or on our website.',
                        'user_id' => $admin->id
                    ]));
                }
            }

            $users = User::with('personal_subscription')
                ->whereIn('user_type', ['student', 'teacher'])
                ->get();

            if ($users->isNotEmpty()) {
                foreach ($users as $user) {
                    $user->notify(new UserNotification([
                        'message' => 'We have updated our billing agreement. Please review the changes in your account settings or on our website.',
                        'user_id' => $user->id
                    ]));
                }
            }
        }

        if ($data->content_type === 'privacy policy') {
            $insAdmins = User::where('user_type', 'admin')->get();

            if ($insAdmins->isNotEmpty()) {
                foreach ($insAdmins as $admin) {
                    $admin->notify(new InstitutionAdminNotification([
                        'message' => 'We have updated our privacy policy. Please review the changes in on our website.',
                        'user_id' => $admin->id
                    ]));
                }
            }

            $users = User::whereIn('user_type', ['student', 'teacher'])->get();

            if ($users->isNotEmpty()) {
                foreach ($users as $user) {
                    $user->notify(new UserNotification([
                        'message' => 'We have updated our privacy policy. Please review the changes on our website.',
                        'user_id' => $user->id
                    ]));
                }
            }
        }

        if ($data->content_type === 'terms and conditions') {
            $insAdmins = User::where('user_type', 'admin')->get();

            if ($insAdmins->isNotEmpty()) {
                foreach ($insAdmins as $admin) {
                    $admin->notify(new InstitutionAdminNotification([
                        'message' => 'We have updated our terms and conditions. Please review the changes in on our website.',
                        'user_id' => $admin->id
                    ]));
                }
            }

            $users = User::whereIn('user_type', ['student', 'teacher'])->get();

            if ($users->isNotEmpty()) {
                foreach ($users as $user) {
                    $user->notify(new UserNotification([
                        'message' => 'We have updated our terms and conditions. Please review the changes on our website.',
                        'user_id' => $user->id
                    ]));
                }
            }
        }



        return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Terms and conditions updated successfully.');
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        CustomContent::find($id)->delete();

        return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Terms and conditions deleted successfully.');
    }
    

    public function change_status(Request $request, $id): RedirectResponse
    {

        $termsAndCondition = CustomContent::find($id);
        $oldStatus = $termsAndCondition->content_status;


        if ($termsAndCondition->content_status === 'available') {
            $termsAndCondition->update([
                'content_status' => 'unavailable',
            ]);
        } else if ($termsAndCondition->content_status === 'unavailable') {
            $termsAndCondition->update([
                'content_status' => 'available',
            ]);
        } else {
            \Log::info('Something went wrong');
        }

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Updated Content',
            'log_activity_content' => "Updated the status of <strong?>{$termsAndCondition->content_type}</strong> entitled <strong>{$termsAndCondition->content_title}</strong> from <strong>{$oldStatus}</strong> to <strong>{$termsAndCondition->content_status}</strong>.",
        ]);

        return redirect(route('manage-terms-and-conditions.index'))->with('success', 'Status updated.');
    }

    public function terms_and_conditions()
    {
        $termsConditions = CustomContent::where('content_type', 'terms and conditions')
        ->where('content_status', 'available')
        ->get();

        // Get the latest updated item from the collection
        $latest = $termsConditions->sortByDesc('updated_at')->first();

        // Format the updated_at field
        $lastUpdated = $latest ? Carbon::parse($latest->updated_at)->format('F d, Y') : null;

        return Inertia::render('TermsandConditions', [
            'termsConditions' => $termsConditions,
            'lastUpdated' => $lastUpdated,
        ]);
    }

    public function privacyPolicy()
    {
        $privacyPolicy = CustomContent::where('content_type', 'privacy policy')
                        ->first();

        return Inertia::render('PrivacyPolicy', [
            'privacyPolicy' => $privacyPolicy,
        ]);
    }


}
