<?php


namespace App\Http\Controllers\Pages\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Mail\AdminRegistrationMail;
use App\Models\AccessControl;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Inertia\Inertia;
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

    public function filter($userType = null, $isJsonResponse = false, Request $request = null)
    {
        $request = $request ?? request(); // If $request is null, use the current request object

        // Convert hyphen to underscore only for querying the database
        $userType = str_replace('-', '_', $userType);

        $searchName = session('search_name') ?? '';
        $entriesPerPage = session('entries_per_page') ?? 10;
        $selectedUniversity = $request->query('selected_university', null);
        $selectedBranch = $request->query('selected_branch', null);
        $selectedDepartment = $request->query('selected_department', null);
        $selectedCourse = $request->query('selected_course', null);
        $selectedCurrentPlan = $request->query('selected_current_plan', null);
        $selectedInsAdminRole = $request->query('selected_ins_admin_role', null);
        $selectedSuperAdminRole = $request->query('selected_super_admin_role', null);
        $selectedDateCreated = $request->query('selected_date_created', null);
        $selectedStatus = $request->query('selected_status', null);
        $isJsonResponse = $request->query('is_json_response', $isJsonResponse);

        // Base query to get users
        $query = User::where('user_type', $userType)
            ->whereRaw('LOWER(name) LIKE ?', ["%" . strtolower($searchName) . "%"])
            ->select('id', 'name', 'email', 'is_premium', 'user_pic', 'created_at', 'user_status');

        if ($selectedUniversity) {
            $query->whereHas('student.university_branch.university', function ($q) use ($selectedUniversity) {
                $q->where('uni_name', $selectedUniversity);
            });
        }
        if ($selectedBranch) {
            $query->whereHas('student.university_branch', function ($q) use ($selectedBranch) {
                $q->where('uni_branch_name', $selectedBranch);
            });
        }
        if ($selectedDepartment) {
            $query->whereHas('student.university_branch.department', function ($q) use ($selectedDepartment) {
                $q->where('dept_name', $selectedDepartment);
            });
        }
        if ($selectedCourse) {
            $query->whereHas('student.university_branch.department.course', function ($q) use ($selectedCourse) {
                $q->where('course_name', $selectedCourse);
            });
        }

        // Load the relationships based on user type
        switch ($userType) {
            case 'student':
                $query->with([
                    'student:id,user_id,uni_branch_id',
                    'student.university_branch:id,uni_id,uni_branch_name',
                    'student.university_branch.university:id,uni_name',
                    'student.university_branch.department.course:id,course_name,dept_id',
                    'student.university_branch.department:id,dept_name,uni_branch_id',
                ]);
                break;
            case 'faculty':
                $query->with([
                    'faculty:id,user_id,uni_branch_id,fac_position',
                    'faculty.university_branch:id,uni_id,uni_branch_name',
                    'faculty.university_branch.university:id,uni_name',
                    'faculty.university_branch.department:id,dept_name,uni_branch_id',
                ]);
                break;
            case 'institution_admin':
                $query->with([
                    'institution_admin:id,user_id,insub_id',
                    'institution_admin.institution_subscription:id,uni_branch_id,plan_id',
                    'institution_admin.institution_subscription.plan:id',
                    'institution_admin.institution_subscription.university_branch:id,uni_id,uni_branch_name',
                    'institution_admin.institution_subscription.university_branch.university:id,uni_name',
                    'access_control:access_id,user_id,role',
                ]);
                break;
            case 'super_admin':
                $query->with([
                    'access_control:access_id,user_id,role',
                ]);
                break;
        }

        $users = $query->latest()->paginate($entriesPerPage);


        if (!$isJsonResponse) {
            return Inertia::render('SuperAdmin/Users/Users', [
                'users' => $users,
                'userType' => $userType,
            ]);
        }

        return response()->json($users);
    }

    public function setStatus(Request $request)
    {
        $userId = $request->input('user_id');
        $user = User::findOrFail($userId);
        $user->user_status = $user->user_status === 'active' ? 'deactivated' : 'active';

        $user->save();
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

    public function logs($userId, Request $request)
    {
        // For search filter
        $searchActivity = $request->get('search_activity', '');

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
        // Retrieve the token data based on a token
        $tokenData = DB::table('admin_registration_tokens')->where('token', $token)->first();

        // Check if token exists and if it has expired
        if (!$tokenData || $tokenData->used || Carbon::parse($tokenData->expires_at)->isPast()) {
            return Inertia::render('ErrorPage');
        }

        return Inertia::render('Auth/AdminRegistration', ['tokenData' => $tokenData]);
    }

    public function submitAdminRegistration(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8|confirmed',  // Ensures password matches password_confirmation
            'password_confirmation' => 'required|string|min:8'
        ]);


        // Start a transaction to ensure both User and AccessControl are inserted successfully
        // and to avoid data anomalies
        DB::beginTransaction();

        try {
            // Disable the admin insertion trigger
            DB::statement('SET @DISABLE_ADMIN_INSERTION_TRIGGER = TRUE;');

            // Parse the access JSON from the encoded value in the database
            $access = json_decode($request->input('access'), true) ?? [];

            Log::info('access:', ['access' => $access]);


            $token = $request->input('token');
            $userType = $request->input('user_type');
            $name = $request->input('name');

            $user = User::create([
                'user_type' => $userType,
                'name' => $name,
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password']),
                'user_status' => 'pending',
            ]);
            // Log::info('User created:', ['user_id' => $user->user_id]); // Log the user_id to confirm

            $tokenTable = DB::table('admin_registration_tokens')->where('token', $token)->first();

            if ($tokenTable) {

                $accessControlData = [
                    'user_id' => $user->id,
                    'role' => $userType === 'institution_admin' ? "co_institution_admin" : "co_super_admin",
                ];

                $accessControlModel = new AccessControl();

                // Loop through the fillable fields of AccessControl and dynamically assign values to dynamic $accessControlData var
                foreach ($accessControlModel->getFillable() as $fillableField) {
                    // Skip these unrelated access columns
                    if (in_array($fillableField, ['user_id', 'role'])) {
                        continue;
                    }

                    if (Schema::hasColumn('access_controls', $fillableField)) {
                        $accessControlData[$fillableField] = in_array($fillableField, $access) ? true : false;
                    }
                }

                AccessControl::create($accessControlData);

                // Update the used column after the insertion takes place in the users and access_control tables
                DB::table('admin_registration_tokens')->where('token', $token)->update(['used' => true]);
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

        // return response()->json([
        //     'current_page' => $users->currentPage(),
        //     'data' => $users->items(),
        //     'first_page_url' => $users->firstPageUrl(),
        //     'from' => $users->firstItem(), // Changed from `firstPageUrl()` to `firstItem()`
        //     'last_page' => $users->lastPage(),
        //     'last_page_url' => $users->lastPageUrl(), // Changed from `firstPageUrl()` to `lastPageUrl()`
        //     'links' => $users->links()->toArray(), // Adjust as needed; assuming you want pagination links
        //     'next_page_url' => $users->nextPageUrl(),
        //     'path' => $users->path(), // Changed from `nextPageUrl()` to `path()`
        //     'per_page' => $users->perPage(),
        //     'prev_page_url' => $users->previousPageUrl(),
        //     'to' => $users->lastItem(), // Changed from `previousPageUrl()` to `lastItem()`
        //     'total' => $users->total(),
        // ]);