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
        \Log::info("hello");

        $request->authenticate();
        $authenticatedUser = Auth::user();

        if($authenticatedUser->user_type !== 'general_user')
        {
            // Get the data of the user and student table
            $user = $authenticatedUser->load(['student', 'faculty']);

            // Check if user is affiliated with an institution
            if ($user->user_type != 'admin' && $user->user_type != 'superadmin') {
                if ($user->user_type == 'student') {
                    $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->student->uni_branch_id)->first();
                } elseif ($user->user_type == 'teacher') {
                    $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->faculty->first()->uni_branch_id)->first();
                }

                if($user->is_premium == 0 || $user->is_affiliated == 0) {
                    $this->checkInstitutionSubscription($checkInSub, $user);
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
                $request->session()->regenerate();

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
