<?php

namespace App\Http\Controllers;


use App\Traits\CheckSubscriptionTrait;
use App\Http\Requests\ProfileUpdateRequest;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use Inertia\Inertia;
use Inertia\Response;


use App\Models\InstitutionSubscription;
use App\Models\Student;



class ProfileController extends Controller
{

    public function showProfilePic($filename)
    {
        $path = storage_path('app/public/profile_pics/' . $filename);

        if (!Storage::disk('public')->exists('profile_pics/' . $filename)) {
            abort(404);
        }

        return Response::file($path);
    }

    public function edit(Request $request): Response
    {
        $user = Auth::user();
        

        if($user->user_type === 'superadmin' || $user->user_type === 'admin')
        {
            return Inertia::render('SuperAdmin\Profile\Edit', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => session('status'),
                'auth' => [
                    'user' => [
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'created_at' => $request->user()->created_at,
                        'user_aboutme' => $request->user()->user_aboutme,
                        'user_type' => $request->user()->user_type,
                        'user_pic' => $request->user()->user_pic,
                        'is_premium' => $request->user()->is_premium,
                        'is_affiliated' => $request->user()->is_affiliated,
                        'user_dob' => $request->user()->user_dob,
                        'uni_id_num' => $request->user()->uni_id_num,
                        'user_pnum' => $request->user()->user_pnum
                        // 'user_pic' => $request->user()->user_pic ? asset('storage/profile_pics/' . $request->user()->user_pic) : null,
                    ]
                ]
            ]);
        } 
        else 
        {

            $uniBranchName = '';
            $uniName = '';

            if($user->user_type === 'student')
            {
                $user->load('student.university_branch.university');

                $uniBranchName = $user->student->university_branch->uni_branch_name;
                $uniName = $user->student->university_branch->university->uni_name;
            }
            else if($user->user_type === 'teacher')
            {
                $user->load('faculty.university_branch.university');

                $uniBranchName = $user->faculty->first()->university_branch->uni_branch_name;
                $uniName = $user->faculty->first()->university_branch->university->uni_name;
            }
           

            return Inertia::render('Profile/Edit', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => session('status'),
                'auth' => [
                    'user' => [
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'created_at' => $request->user()->created_at,
                        'user_aboutme' => $request->user()->user_aboutme,
                        'user_type' => $request->user()->user_type,
                        'user_pic' => $request->user()->user_pic,
                        'is_premium' => $request->user()->is_premium,
                        'is_affiliated' => $request->user()->is_affiliated,
                        'user_dob' => $request->user()->user_dob,
                        'uni_id_num' => $request->user()->uni_id_num,
                        'user_pnum' => $request->user()->user_pnum,
                        'university' => $uniName . ' ' . $uniBranchName
                        // 'user_pic' => $request->user()->user_pic ? asset('storage/profile_pics/' . $request->user()->user_pic) : null,
                    ]
                ]
            ]);
        }

      
    }


    /**
     * Update the user's profile information.
     */
    public function update(Request $request): \Illuminate\Http\JsonResponse
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'uni_id_num' => 'nullable|string|max:11',
            'user_pnum' => 'nullable|string|max:11',
            'user_aboutme' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Update user details
        $user->fill($validated);

        // Reset email verification if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Save user
        $user->save();

        // Return JSON response
        return response()->json(['message' => 'Profile updated successfully!']);
    }

    /**
     * Update the user's profile picture.
     */
    public function updatePicture(Request $request): \Illuminate\Http\JsonResponse
    {

        $file = $request->file('user_pic');
        \Log::info('file:', ['file' => $file]);

        Log::info('User Profile');
        // Validate request
        $request->validate([
            'user_pic' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        $imageName = $user->name . '_' . time().'.'.$request->user_pic->extension();
        $request->user_pic->move(public_path('storage/profile_pics'), $imageName);

        $user->update([
            'user_pic' => 'storage/profile_pics/' . $imageName,
        ]);


        Log::info($user->toArray());

        // Return JSON response
        return response()->json(['message' => 'Profile picture updated successfully!']);
    }



    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    use CheckSubscriptionTrait;

    public function affiliateUniversity(Request $request)
    {
        try {
            $request->validate([
                'uni_branch_id' => 'required|integer',
                'uni_id_num' => 'required|string|max:20',
            ]);

            $user = Auth::user();
            $student = Student::where('user_id', $user->id)->first();
            
            $subscriptionExist = InstitutionSubscription::where('uni_branch_id', $student->uni_branch_id)
                ->where('insub_status', 'Active')
                ->first();

            if ($subscriptionExist == null) {
                return response()->json([
                    'is_affiliated' => $user->is_affiliated,
                    'message' => 'Your university currently does not have an active subscription. Please reach out to your institution for more information or updates.'
                ]);
            } else {
                $result = $this->checkInstitutionSubscription($subscriptionExist, $user);

                 //Return true if user exist in the csv file
                if ($result['status']  == true) {

                    $user->update([
                        'uni_id_num' => $request->uni_id_num
                    ]);

                    $student->update([
                        'uni_branch_id' => $request->uni_branch_id
                    ]);

                   
                    return response()->json([
                        'message' => $result['message'],
                        'is_affiliated' => $user->is_affiliated
                    ]);
                } 
                 //Return false if user exist does not exist or there's no uploaded csv or university does not have an active subscription
                else {
                    return response()->json([
                        'is_affiliated' => $user->is_affiliated,
                        'message' => $result['message']
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Catch all exceptions, including validation errors
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function removeAffiliation(Request $request)
    {
        $user = Auth::user()->load(['student', 'faculty']);

        $user->update([
            'is_affiliated' => false
        ]);

        

        return response()->json([
            'is_affiliated' => $user->is_affiliated
        ]);

    }

}
