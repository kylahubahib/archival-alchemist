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
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Auth;




class UserController extends Controller
{
    protected $authUserId;
    protected $adminRoleMap;
    protected $userTypeMap;
    // protected $totalAffiliatedPremiumUsers;
    // protected $planUserLimit;

    public function __construct()
    {
        $this->authUserId = Auth::id();
        // Format roles or user types for display in user logs
        $this->adminRoleMap = [
            'super_admin' => 'Super Admin',
            'co_super_admin' => 'Co-Super Admin',
            'institution_admin' => 'Institution Admin',
            'co_institution_admin' => 'Co-Institution Admin',
        ];
        $this->userTypeMap = [
            'teacher' =>  'Teacher',
            'student' =>  'Student',
        ];

        // Get the institution subscription related data for the authenticated institution admin
        //     $commonData = new InsAdminCommonDataController();
        //     $this->totalAffiliatedPremiumUsers = $commonData->getTotalAffiliatedPremiumUsers();
        //     $this->planUserLimit = $commonData->getPlanUserLimit();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->filter('student');
    }

    public function filter($userType)
    {
        $university = request('university', null);
        $branch = request('branch', null);
        $department = request('department', null);
        $course = request('course', null);
        $section = request('section', null);
        $currentPlan = request('plan', null);
        $insAdminRole = request('ins_admin_role', null);
        $superAdminRole = request('super_admin_role', null);
        $dateCreated = request('date_created', null);
        $status = request('status', null);
        $searchValue = request('search', null);
        $entries = request('entries', 10);

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
                    'access_control:id,user_id,role',
                ]);
                break;
            case 'superadmin':
                $query->with([
                    'access_control:id,user_id,role',
                ]);
                break;
        }


        if ($searchValue) {
            $query->where(function ($q) use ($searchValue) {
                $q->where('name', 'LIKE', '%' . $searchValue . '%');
                $q->orWhere('email', 'LIKE', '%' . $searchValue . '%');
                $q->orWhere('id', $searchValue);
            });
        }

        if ($university) {
            $query->whereHas('student.university_branch.university', function ($q) use ($university) {
                $q->where('uni_acronym', $university);
            });
        }

        if ($branch) {
            $query->whereHas('student.university_branch', function ($q) use ($branch) {
                $q->where('uni_branch_name', $branch);
            });
        }

        if ($department) {
            $query->whereHas('student.section.course.department', function ($q) use ($department) {
                $q->where('dept_acronym', $department);
            });
        }

        if ($course) {
            $query->whereHas('student.section.course', function ($q) use ($course) {
                $q->where('course_acronym', $course);
            });
        }

        if ($section) {
            $query->whereHas('student.section', function ($q) use ($section) {
                $q->where('section_name', $section);
            });
        }

        if ($currentPlan === 'Basic') {
            $query->where('is_premium', false);
        } else {
            $query->where('is_premium', true);
        }

        if ($superAdminRole === 'Super Admin') {
            $query->whereHas('access_control', function ($q) {
                $q->where('role', 'super_admin');
            });
        } else if ($superAdminRole === 'Co-Super Admin') {
            $query->whereHas('access_control', function ($q) {
                $q->where('role', 'co_super_admin');
            });
        }

        if ($insAdminRole === 'Institution Admin') {
            $query->whereHas('access_control', function ($q) {
                $q->where('role', 'institution_admin');
            });
        } else if ($insAdminRole === 'Co-Institution Admin') {
            $query->whereHas('access_control', function ($q) {
                $q->where('role', 'co_institution_admin');
            });
        }

        if ($dateCreated) {
            [$startDate, $endDate] = explode(' - ', $dateCreated);
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        if ($status) {
            $query->where('user_status', $status);
        }


        $users = $query->latest()->paginate($entries)->withQueryString();

        if (request()->expectsJson()) {
            return response()->json($users);
        }

        return Inertia::render('SuperAdmin/Users/Users', [
            'userType' => $userType,
            'users' => $users,
            'entries' => $entries,
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

        $formatUserRole = '';

        if ($user->user_type === 'superadmin' || $user->user_type === 'admin') {
            $formatUserRole = $this->adminRoleMap[$user?->access_control?->role] ?? $user->user_type ?? 'Unknown Role';
        } else if ($user->user_type === 'student' || $user->user_type === 'teacher') {
            $formatUserRole = $this->userTypeMap[$user?->user_type] ?? 'Unknown Role';
        }

        UserLog::create([
            'user_id' => $this->authUserId,
            'log_activity' => 'Updated user status',
            'log_activity_content' => "Updated the status of <strong>{$user->name} ({$formatUserRole})</strong> to <strong>{$user->user_status}</strong>.",
        ]);

        return response()->json(['message' => 'User status updated successfully']);
    }

    public function logs(Request $request)
    {
        $searchActivity = $request->get('search_activity');
        $userId = $request->get('user_id');
        $startDate = $request->get('start_date', null);
        $endDate = $request->get('end_date', null);

        Log::info(['user id' => $userId]);

        $query = UserLog::query();

        // Filter by user ID
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Filter by search activity
        if ($searchActivity) {
            $query->where('log_activity', 'like', '%' . $searchActivity . '%');
        }

        // Filter by date range
        if ($startDate && $endDate) {
            $startDate = Carbon::parse($startDate)->startOfDay();
            $endDate = Carbon::parse($endDate)->endOfDay();
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Paginate results
        $userLogs = $query->latest()->paginate(20); // Reduce page size for performance

        return response()->json($userLogs);
    }

    public function sendAdminRegistration(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
        ]);

        $token = Str::random(50);
        $userType = $request->input('user_type');
        $uniBranchId = $request->input('uni_branch_id');
        $name = $validatedData['name'];
        $email = $validatedData['email'];
        $access = json_encode($request->input('access')); // Encode the access array to JSON
        $registrationLink = route('admin.registration-form', ['token' => $token]);

        \Log::info(['userType' => $userType]);

        // Check if the plan user limit has been reached before adding a co-institution-admin
        if ($userType === 'admin' && $this->totalAffiliatedPremiumUsers >= $this->planUserLimit) {
            return back()->with('error', 'Unable to add co-institution-admin. The plan user limit has been reached.');
        }

        Log::info(['uni_branch_id' => $uniBranchId]);

        DB::beginTransaction();

        try {
            DB::table('admin_registration_tokens')->insert([
                'token' => $token,
                'uni_branch_id' => $uniBranchId,
                'name' => $name,
                'email' => $email,
                'user_type' => $userType,
                'access' => $access,
                'expires_at' => Carbon::now()->addDay(),
            ]);

            // Attempt to send the email
            Mail::to($email)->send(new AdminRegistrationMail($userType, $name, $email, $access, $registrationLink));

            // Commit the transaction if both operations succeed
            DB::commit();

            return redirect()->back()->with('message', 'Email sent successfully!');
        } catch (\Exception $e) {
            // Rollback the transaction if either operation fails
            DB::rollBack();

            // Log the error for debugging
            Log::error('Error during admin registration: ' . $e->getMessage());

            return redirect()->back()->with('error', 'An error occurred while processing your request. Please try again later.');
        }
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
            'password' => 'required|string|min:8|confirmed',
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

            $accessControlData = []; // Reset the data array

            if ($tokenTable) {
                $accessControlData = [
                    'user_id' => $user->id, // Ensure the user_id is assigned here
                    'role' => $validatedData['user_type'] === 'admin' ? "co_institution_admin" : "co_super_admin",
                ];

                $accessControlModel = new AccessControl();


                // Loop through fillable fields and set the access control permissions
                foreach ($accessControlModel->getFillable() as $fillableField) {
                    if (in_array($fillableField, ['user_id', 'role', 'uni_branch_id'])) {
                        continue; // Skip the fields we don't want to fill here
                    }

                    if (Schema::hasColumn('access_controls', $fillableField)) {
                        $accessControlData[$fillableField] = in_array($fillableField, $access) ? true : false;
                    }
                }

                // Include uni_branch_id if available
                if ($request->input('uni_branch_id')) {
                    $accessControlData['uni_branch_id'] = $request->input('uni_branch_id');
                }

                Log::info(['ACCESSCONTROL DATA' => $accessControlData]);

                // Create the access control record with the user_id and other data
                $accessControl = AccessControl::create($accessControlData);

                // Now the access control record has been created, including the uni_branch_id and user_id

                // Mark token as used
                DB::table('admin_registration_tokens')->where('token', $validatedData['token'])->update(['used' => true]);
            }

            // Re-enable the admin insertion trigger
            DB::statement('SET @DISABLE_ADMIN_INSERTION_TRIGGER = FALSE;');

            DB::commit();

            return redirect('/login')->with('message', 'User registered successfully.');
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

        // // Log the action of updating admin access
        // $user = User::findOrFail($userId);
        // $previousAccess = $accessControl->getAttributes();

        // Reset all fields to false based on fillable attributes
        foreach ($accessControl->getFillable() as $accessColumn) {
            if (in_array($accessColumn, ['user_id', 'role', 'uni_branch_id'])) {
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

        // UserLog::create([
        //     'user_id' => Auth::id(),
        //     'log_activity' => "Updated Admin Access",
        //     'log_activity_content' => "Updated admin access for <strong>{$user->name}</strong>. Previous access: " . json_encode($previousAccess) . " New access: " . json_encode($accessControl->getAttributes()), // Log previous and updated access
        // ]);

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
