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

        //Get the data of the user and student table
        $user = Auth::user()->load(['student', 'faculty']);

        //Check if user is affiliated with an institution
        //$user->student->uni_branch_id : Eloquent way of retrieving data from the student table

        if($user->user_type != 'admin' && $user->user_type != 'superadmin')
        {
            if($user->user_type == 'student') {
                $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->student->uni_branch_id)->first();
            }

            if($user->user_type == 'teacher') {
                $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->faculty->uni_branch_id)->first();
            }

            
            $this->checkInstitutionSubscription($checkInSub, $user);
           

        }

        // Redirect based on user_type
        switch ($user->user_type) {
            case 'student':
                return redirect()->route('library')->with('user', $user);
                break;
            case 'teacher':
                return redirect()->route('library');
                break;
            case 'admin':
                return redirect()->route('institution-students');
                break;
            case 'superadmin':
                return redirect()->route('dashboard.index');
                break;
            default:
                return redirect('/');
                break;
        }
//ok

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
