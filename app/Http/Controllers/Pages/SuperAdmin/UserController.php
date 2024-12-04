<?php


namespace App\Http\Controllers\Pages\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Mail\AdminRegistrationMail;
use App\Mail\PasswordResetMail;
use App\Mail\ResetPasswordMail;
use App\Models\AccessControl;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Mail::to('mmpurposes1@gmail.com')->send(new AdminRegistrationMail());

        // Shows the students list as the page loads 
        return $this->filter('student');
    }

    public function filter($userType)
    {
        $university = request('university', null);
        $branch = request('branch', null);
        $department = request('department', null);
        $course = request('course', null);
        $currentPlan = request('current_plan', null);
        $insAdminRole = request('ins_admin_role', null);
        $superAdminRole = request('super_admin_role', null);
        $dateCreated = request('date_created', null);
        $status = request('status', null);
        $searchValue = request('search', null);
        Log::info(['searchValue' => $searchValue]);
        $entries = request('entries', null);

        // Base query to get the users
        $query = User::where('user_type', $userType)
            ->select('id', 'name', 'email', 'is_premium', 'user_pic', 'created_at', 'user_status');

        // Load the relationships with specific columns selected based on user type for performance optimization
        switch ($userType) {
            case 'student':
                $query->with([
                    'student:id,user_id,section_id,uni_branch_id',
                    'student.university_branch:id,uni_id,uni_branch_name',
                    'student.university_branch.university:id,uni_name,uni_acronym',
                    'student.section:id,course_id,section_name',
                    'student.section.course:id,course_name,course_acronym,dept_id',
                    'student.section.course.department:id,dept_name,dept_acronym,uni_branch_id',
                ]);
                break;
            case 'teacher':
                $query->with([
                    'faculty:id,user_id,course_id,uni_branch_id,faculty_position',
                    'faculty.university_branch:id,uni_id,uni_branch_name',
                    'faculty.university_branch.university:id,uni_name,uni_acronym',
                    'faculty.department:id,dept_name,dept_acronym',
                ]);
                break;
            case 'admin':
                $query->with([
                    'institution_admin:id,user_id,insub_id',
                    'institution_admin.institution_subscription:id,uni_branch_id,plan_id',
                    'institution_admin.institution_subscription.plan:id',
                    'institution_admin.institution_subscription.university_branch:id,uni_id,uni_branch_name',
                    'institution_admin.institution_subscription.university_branch.university:id,uni_name,uni_acronym',
                    'access_control:access_id,user_id,role',
                ]);
                break;
            case 'superadmin':
                $query->with([
                    'access_control:access_id,user_id,role',
                ]);
                break;
        }

        // Filters
        if ($searchValue) {
            $query->where(function ($q) use ($searchValue) {
                $q->where('name', 'LIKE', '%' . $searchValue . '%')
                    ->orWhere('id', $searchValue); // Use orWhere here
            });
        }

        if ($university) {
            $query->whereHas('student.university_branch.university', function ($q) use ($university) {
                $q->where('uni_name', $university);
            });
        }
        if ($branch) {
            $query->whereHas('student.university_branch', function ($q) use ($branch) {
                $q->where('uni_branch_name', $branch);
            });
        }
        if ($department) {
            $query->whereHas('student.university_branch.department', function ($q) use ($department) {
                $q->where('dept_name', $department);
            });
        }
        if ($course) {
            $query->whereHas('student.university_branch.department.course', function ($q) use ($course) {
                $q->where('course_name', $course);
            });
        }

        $users = $query->latest()->paginate($entries);

        Log::info($users->toArray());

        if (request()->expectsJson()) {
            return response()->json($users);
        }

        return Inertia::render('SuperAdmin/Users/Users', [
            'userType' => $userType,
            'users' => $users,
            'searchValue' => $searchValue,
        ]);
    }

    public function updateStatus(Request $request)
    {
        $userId = $request->input('user_id');
        $action = $request->input('action');

        Log::info(['action' => $action]);

        $user = User::findOrFail($userId);

        switch ($action) {
            case 'Activate':
                $user->user_status = 'Active';
                break;

            case 'Deactivate':
                $user->user_status = 'Deactivated';
                break;

            default:
                return response()->json(['error' => 'Invalid action'], 400);
        }

        $user->save();

        return response()->json(['message' => 'User status updated successfully']);
    }

    // Functions that set the sesssion variables
    public function setEntriesPerPage(Request $request)
    {
        session(['entries_per_page' => $request->input('entries_per_page')]);
    }

    public function setSearchedName(Request $request)
    {
        session(['search_name' => $request->input('search_name')]);
    }

    public function logs(Request $request)
    {
        // For search filter
        $searchActivity = $request->get('search_activity', '');
        $userId = $request->get('user_id', null);
        // For date filter
        $startDate = $request->get('start_date', null);
        $endDate = $request->get('end_date', null);

        // Initialize the user logs query
        $userLogs = UserLog::where('user_id', $userId);

        if (!empty($searchActivity)) {
            $userLogs->whereRaw('LOWER(log_activity) LIKE ?', ["%" . strtolower($searchActivity) . "%"]);
        }

        if ($startDate && $endDate) {
            $userLogs->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Fetch logs and format the created_at date
        $userLogs = $userLogs->get()->map(function ($log) {
            $log->created_at = Carbon::parse($log->created_at)->format('m-d-Y H:i');
            return $log;
        });

        return response()->json($userLogs);
    }

    public function sendAdminRegistration(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',  // Check if the email exists
        ]);

        $token = Str::random(50);
        $userType = $request->input('user_type');
        $name = $validatedData['name'];
        $email = $validatedData['email'];
        $access = json_encode($request->input('access')); // Encode the access array to JSON
        // Log::info("access", $access);

        $registrationLink = route('admin.registration-form', ['token' => $token]);

        // Insert the fields into this token table for temporary use
        DB::table('admin_registration_tokens')->insert([
            'token' => $token,
            'name' => $name,
            'email' => $email,
            'user_type' => $userType,
            'access' => $access,
            'expires_at' => Carbon::now()->addDay(),
        ]);

        // Send the email
        Mail::to($email)->send(new AdminRegistrationMail($userType, $name, $email, $access, $registrationLink));

        return redirect()->back()->with('message', 'Email sent successfully!');
    }


    public function adminRegistrationForm($token)
    {
        // Retrieve the token data based on the provided token
        $tokenData = DB::table('admin_registration_tokens')->where('token', $token)->first();

        // Check if the token exists and if it has been used or expired
        if (!$tokenData || $tokenData->used || Carbon::parse($tokenData->expires_at)->isPast()) {
            // Delete the invalid or expired token
            DB::table('admin_registration_tokens')->where('token', $token)->delete();

            return Inertia::render('ErrorPage');
        }

        return Inertia::render('Auth/AdminRegistration', ['tokenData' => $tokenData]);
    }


    public function submitAdminRegistration(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8|confirmed', // Ensures password matches password_confirmation
            'password_confirmation' => 'required|string|min:8',
            'access' => 'nullable|json',
            'token' => 'required|string',
            'user_type' => 'required|string',
            'name' => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            // Disable the admin insertion trigger
            DB::statement('SET @DISABLE_ADMIN_INSERTION_TRIGGER = TRUE;');

            $access = json_decode($validatedData['access'], true) ?? [];

            // Create the user
            $user = User::create([
                'user_type' => $validatedData['user_type'],
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'user_status' => 'active',
                'email_verified_at' => Carbon::now(),
            ]);

            $tokenTable = DB::table('admin_registration_tokens')
                ->where('token', $validatedData['token'])
                ->first();

            if ($tokenTable) {
                $accessControlData = [
                    'user_id' => $user->id,
                    'role' => $validatedData['user_type'] === 'institution_admin' ? "co_institution_admin" : "co_super_admin",
                ];

                $accessControlModel = new AccessControl();

                foreach ($accessControlModel->getFillable() as $fillableField) {
                    if (in_array($fillableField, ['user_id', 'role'])) {
                        continue;
                    }

                    if (Schema::hasColumn('access_controls', $fillableField)) {
                        $accessControlData[$fillableField] = in_array($fillableField, $access) ? true : false;
                    }
                }

                AccessControl::create($accessControlData);

                // Mark token as used
                DB::table('admin_registration_tokens')->where('token', $validatedData['token'])->update(['used' => true]);
            }

            // Re-enable the admin insertion trigger
            DB::statement('SET @DISABLE_ADMIN_INSERTION_TRIGGER = FALSE;');

            DB::commit();

            return redirect()->back()->with('message', 'User registered successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            DB::statement('SET @DISABLE_ADMIN_INSERTION_TRIGGER = FALSE;');

            Log::error('Failed to register user and access controls', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors(['password_confirmation' => 'Register failed. Something went wrong.']);
        }
    }


    public function adminAccess($userId)
    {
        // Retrieve the fillable attributes from the AccessControl model to be used as columns selection
        $fillableColumns = (new AccessControl())->getFillable();

        $filteredColumns = [];

        foreach ($fillableColumns as $fillableField) {
            // Skip these unrelated access columns
            if (in_array($fillableField, ['user_id', 'role'])) {
                continue;
            }
            $filteredColumns[] = $fillableField; // Add the field to the filtered array
        }

        $adminAccess = AccessControl::where('user_id', $userId)
            ->select($filteredColumns)
            ->get();

        return response()->json($adminAccess);
    }


    public function updateAdminAccess(Request $request)
    {
        $userId = $request->input('user_id');
        $updatedAccessColumns = $request->input('updated_access_columns', []);
        $accessControl = AccessControl::where('user_id', $userId)->first();

        // Reset all fields to false based on fillable attributes
        foreach ($accessControl->getFillable() as $accessColumn) {
            if (in_array($accessColumn, ['user_id', 'role'])) {
                continue;
            }
            if (Schema::hasColumn('access_controls', $accessColumn)) {
                $accessControl->$accessColumn = false;
            }
        }

        // Then, set only the updated columns to true
        foreach ($updatedAccessColumns as $accessColumn) {
            if (Schema::hasColumn('access_controls', $accessColumn)) {
                $accessControl->$accessColumn = true;
            }
        }

        $accessControl->save();
    }

    public function sendPasswordReset(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255|exists:users,email',  // Check if the email exists in the users table
        ]);

        // Fetch the user record from the database
        $user = User::where('email', $validatedData['email'])->first();

        if ($user) {
            // Generate token
            $token = Str::random(50);

            // Pass the token here
            $passwordResetLink = route('users.password-reset-form', ['token' => $token]);

            // Insert the fields into the password reset tokens table for temporary use
            DB::table('password_reset_tokens')->insert([
                'token' => $token,
                'email' => $validatedData['email'],
                'expires_at' => Carbon::now()->addDay(),
            ]);

            // Send the email
            Mail::to($validatedData['email'])->send(new PasswordResetMail($user->name, $validatedData['email'], $passwordResetLink));

            return redirect()->back()->with('message', 'Password changed successfully.');
        }
    }


    public function passwordResetForm($token)
    {
        // Retrieve the token data based on the provided token
        $tokenData = DB::table('password_reset_tokens')->where('token', $token)->first();

        // Check if the token exists and if it has been used or expired
        if (!$tokenData || $tokenData->used || Carbon::parse($tokenData->expires_at)->isPast()) {
            // Delete the invalid or expired token from the database
            DB::table('password_reset_tokens')->where('token', $token)->delete();

            // Render the error page since the token is invalid or expired
            return Inertia::render('ErrorPage');
        }

        // If the token is valid, return the password reset form
        return Inertia::render('Auth/PasswordReset', ['tokenData' => $tokenData]);
    }


    public function submitPasswordReset(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
            'token' => 'required|string', // Add token to validated data
        ]);

        // Fetch the user by email
        $user = User::where('email', $validatedData['email'])->first();

        // Check if the token exists and is valid
        $tokenTable = DB::table('password_reset_tokens')->where('token', $validatedData['token'])->first();

        if (!$tokenTable) {
            return response()->json(['error' => 'Invalid or expired token.'], 400);
        }

        // Handle the case where the user does not exist
        if (!$user) {
            return response()->json(['error' => 'No account found with the provided email address.'], 404);
        }

        // Mark the token as used
        DB::table('password_reset_tokens')->where('token', $validatedData['token'])->update(['used' => true]);

        // Delete the token after it is marked as used
        DB::table('password_reset_tokens')->where('token', $validatedData['token'])->delete();

        // Update the user's password
        $user->password = Hash::make($validatedData['password']); // Hash the password
        $user->save();

        return redirect('/login')->with('success', 'Your password has been reset successfully.');
    }
}
