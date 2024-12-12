<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

use App\Traits\CheckSubscriptionTrait;
use App\Models\InstitutionSubscription;
use App\Models\UserReport;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class AuthenticatedSessionController extends Controller
{

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $user = Auth::user(); // Get the currently authenticated user
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'user' => $user // Pass the user data to the front end
        ]);
    }

    use CheckSubscriptionTrait;

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        \Log::info("Logging in...");

        $request->authenticate();
        $authenticatedUser = Auth::user();

        $this->checkUserSuspension($authenticatedUser);

        // Refresh the user model incase status updates in the checkUserSuspension
        if ($authenticatedUser->fresh()->user_status === 'Suspended') {
            Auth::guard('web')->logout();
            return Inertia::render('Auth/AccountSuspended');
        }


        if($authenticatedUser->user_type !== 'general_user')
        {
            // Get the data of the user and student table
            $user = $authenticatedUser->load(['student', 'faculty']);

            // Check if user is affiliated with an institution
            if ($user->user_type != 'admin' && $user->user_type != 'superadmin') {

                if ($user->user_type == 'student') {
                    $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->student->uni_branch_id)->first();
                    
                    if($checkInSub->insub_status === 'Inactive') {
                        $user->update([
                            'is_premium' => false
                        ]);
                    }
                    else {

                        if($user->is_premium == 0 && $user->is_affiliated == 1) {
                            $this->checkInstitutionSubscription($checkInSub, $user);
                        }
                    }

                } else if ($user->user_type == 'teacher') {
                    $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->faculty->first()->uni_branch_id)->first();
                    
                    if($checkInSub->insub_status === 'Inactive')
                    {
                        $user->update([
                            'is_premium' => false
                        ]);
                    }
                    else {
                        
                        if($user->is_premium == 0 && $user->is_affiliated == 1) {
                            $this->checkInstitutionSubscription($checkInSub, $user);
                        }
                    }

                }
               
            }

            // Check if the request expects JSON (API request)
            if ($request->expectsJson()) {
                $token = $user->createToken('API Token')->plainTextToken;

                return response()->json([
                    'token' => $token,
                ]);
            }

            // If it's not a JSON request, regenerate session and redirect
            if (!$request->expectsJson()) {
                $session = $request->session()->regenerate();

                Log::info('Token...');
                Log::info($session);


                // Redirect based on user_type
                switch ($user->user_type) {
                    case 'student':
                        return redirect()->route('library')->with('user', $user);
                    case 'teacher':
                        return redirect()->route('library');
                    case 'admin':
                        return redirect()->route('institution-students');
                    case 'superadmin':
                        return redirect()->route('dashboard.index');
                    default:
                        return redirect('/');
                }
            }

        } else
        {
            if ($request->expectsJson()) {
                $token = $authenticatedUser->createToken('API Token')->plainTextToken;

                return response()->json([
                    'token' => $token,
                ]);
            }

            // If it's not a JSON request, regenerate session and redirect
            if (!$request->expectsJson()) {
                $request->session()->regenerate();
                return redirect()->route('library')->with('user', $authenticatedUser);
            }
        }

    }

  
    private function checkUserSuspension($user)
    {
        $report = UserReport::where('reported_user_id', $user->id)
            ->whereNotNull('suspension_start_date') 
            ->whereNotNull('suspension_end_date') 
            ->latest('suspension_end_date') 
            ->first();
    
        if ($report && now()->greaterThan($report->suspension_end_date)) {
            $user->update(['user_status' => 'Active']); 
        }
    }
    


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Log::info('Logging out...');

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/home');
    }
    


}
