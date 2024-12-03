<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

use App\Traits\CheckSubscriptionTrait;
use App\Models\InstitutionSubscription;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;

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
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        // Get the data of the user and student table
        $user = Auth::user()->load(['student', 'faculty']);

        //$facultyExist = $user->faculty->first()->uni_branch_id;

        // Check if user is affiliated with an institution
        if ($user->user_type != 'admin' && $user->user_type != 'superadmin') {
            if ($user->user_type == 'student') {
                $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->student->uni_branch_id)->first();
            } elseif ($user->user_type == 'teacher') {
                $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->faculty->first()->uni_branch_id)->first();
            }


            if ($user->is_premium == 0 || $user->is_affiliated == 0) {
                $this->checkInstitutionSubscription($checkInSub, $user);
            }
        }

        // Redirect based on user_type with super admin access control
        switch ($user->user_type) {
            case 'student':
                return redirect()->route('library')->with('user', $user);
            case 'faculty':
                return redirect()->route('library');
            case 'admin':
                return redirect()->route('institution-students');
            case 'superadmin':
                $accessRoutes = [
                    'dashboard_access' => 'dashboard',
                    'users_access' => 'users',
                    'archives_access' => 'archives',
                    'subscriptions_and_billings_access' => 'subscription-billing',
                    'user_reports_access' => 'user-reports',
                    'user_feedbacks_access' => 'user-feedbacks',
                    'terms_and_conditions_access' => 'terms-condition',
                    'subscription_plans_access' => 'subscription-plans',
                    'faqs_access' => 'faq',
                    'advanced_access' => 'advanced',
                ];

                // Automatically sets the default route redirection if one of the pages can't be accessed.
                foreach ($accessRoutes as $access => $route) {
                    if ($user->access_control->$access) {
                        return redirect()->route($route);
                    }
                }

                // If no access granted for all pages, log out the user and show error
                Auth::logout();
                return redirect()->route('login')->withErrors([
                    'password' => "Can't log in. All page access has been blocked. Please contact support for more information.",
                ]);

            default:
                return redirect('/');
        }
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/home');
    }
}
