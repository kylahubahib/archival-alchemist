<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Log; // Add this line at the top of your controller
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;


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
        // $user->student->uni_branch_id : Eloquent way of retrieving data from the student table

        // if($user->user_type != 'admin' && $user->user_type != 'superadmin')
        // {

        //     if($user->user_type == 'student') {
        //         $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->student->uni_branch_id)->first();
        //     }

        //     if($user->user_type == 'teacher') {
        //         $checkInSub = InstitutionSubscription::where('uni_branch_id', $user->faculty->uni_branch_id)->first();
        //     }

        //     //\Log::info('Check Subscription:', $checkInSub ? $checkInSub->toArray() : 'No subscription found');

        //     //\Log::info('Before checkinsub');
        //     //\Log::info($checkInSub->toArray());

        //     //Check if $checkInSub retrieve a data or is it null
        //     //if ($checkInSub != null && $checkInSub->insub_content != null)
        //    if ($checkInSub != null)
        //     {
        //         //\Log::info('Enter checkinsub ok');

        //         //Retrieve the path of the csv from the data stored in $checkInSub
        //         $filePath = $checkInSub->insub_content;
        //         //Retrieve data from a CSV file and convert it into a PHP array using Laravel Excel
        //         $csvData = Excel::toArray(new UsersImport, public_path($filePath));

        //         //Logging the data retrieved in Auth::user()
        //         Log::info('Auth ' . $user->uni_id_num . ' ' . $user->name . ' ' . $user->user_dob);

        //         //Check if
        //         if (!empty($csvData) && !empty($csvData[0])) {
        //             $data = $csvData[0];
        //             foreach ($data as $row) {
        //                 if (count($row) >= 5) {
        //                     Log::info($row['id_number'] . ' ' . $row['name'] . ' ' . $row['dob']);
        //                     if ($row['id_number'] == $user->uni_id_num && $row['name'] == $user->name && $row['dob'] == $user->user_dob) {
        //                         $user->update([
        //                             'is_premium' => true
        //                         ]);
        //                         Log::info('User upgraded to premium: ', $user->toArray());
        //                         break;
        //                     }
        //                 }
        //             }
        //         } else {
        //             Log::warning('CSV data is empty or not in the expected format.');
        //         }
        //     }

        // }

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
                return redirect()->route('dashboard');
                break;
            default:
                return redirect('/');
                break;
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
