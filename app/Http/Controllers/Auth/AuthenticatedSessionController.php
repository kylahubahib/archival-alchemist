<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        // Show the equivalent hash password
        // dd(Hash::make('password'));
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Check if the user's account is deactivated
        if ($user->user_status === 'deactivated') {
            // Log the user out and redirect with an error message
            Auth::logout();
            return redirect()->route('login')->withErrors([
                'password' => 'Your account is deactivated. Please contact support for more information.',
            ]);
        }

        // Redirect based on user_type
        switch ($user->user_type) {
            case 'student':
                return redirect()->route('savedlist');
            case 'faculty':
                return redirect()->route('class');
            case 'institution_admin':
                return redirect()->route('institution-students');
            case 'super_admin':
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
