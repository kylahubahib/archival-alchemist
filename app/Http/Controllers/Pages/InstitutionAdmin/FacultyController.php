<?php

namespace App\Http\Controllers\Pages\InstitutionAdmin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Models\{Faculty, PersonalSubscription, User};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FacultyController extends Controller
{
    protected $authUserId;
    protected $insAdminUniBranchId;
    protected $insAdminAffiliation;

    public function __construct()
    {
        // Create an instance of CommonDataController to get the values intended for the institution admin
        $commonData = new InsAdminCommonDataController();
        $this->authUserId = Auth::id();
        $this->insAdminUniBranchId = $commonData->getInsAdminUniBranchId();
        $this->insAdminAffiliation = $commonData->getInsAdminAffiliation();
    }

    public function index()
    {
        return $this->filter('with-premium-access');
    }

    public function filter($hasFacultyPremiumAccess)
    {
        $search = request('search', null);
        $department = request('department', null);
        $plan = request('plan', null);
        $planStatus = request('plan_status', null);
        $dateCreated = request('date_created', null);
        $entriesPerPage = (int) request('entries', 10);

        Log::info('search', ['search' => $search]);

        $query = DB::table('users')
            ->join('faculties', 'users.id', '=', 'faculties.user_id')
            ->join('university_branches', 'faculties.uni_branch_id', '=', 'university_branches.id')
            ->leftJoin('courses', 'faculties.course_id', '=', 'courses.id')
            ->leftJoin('departments', 'courses.dept_id', '=', 'departments.id')
            ->leftJoin('personal_subscriptions', 'users.id', '=', 'personal_subscriptions.user_id')
            ->leftJoin('subscription_plans', 'personal_subscriptions.plan_id', '=', 'subscription_plans.id')
            ->select(
                'users.id as user_id',
                'users.name',
                'users.created_at',
                'users.email',
                'users.is_premium',
                'users.user_pic',
                'users.user_status',
                'faculties.id as fac_id',
                'faculties.faculty_position',
                'departments.dept_acronym',
                'subscription_plans.plan_name',
                'personal_subscriptions.start_date',
                'personal_subscriptions.end_date',
                'personal_subscriptions.persub_status',
            )
            ->where('university_branches.id', $this->insAdminUniBranchId);

        if ($hasFacultyPremiumAccess === 'with-premium-access') {
            $query->where('users.is_premium', true);
        } elseif ($hasFacultyPremiumAccess === 'no-premium-access') {
            $query->where('users.is_premium', false);
        }

        if ($search) {
            // Proper way to have multiple where statements is to wrap it in the closure or a function
            // to avoid canceling out the next where queries
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'LIKE', '%' . $search . '%')
                    ->orWhere('faculties.id', 'LIKE', '%' . $search . '%');
            });
        }

        if ($department) {
            $query->where('departments.dept_acronym', $department);
        }

        if ($plan) {
            $query->where('subscription_plans.plan_name', $plan);
        }

        if ($planStatus) {
            $query->where('personal_subscriptions.persub_status', $planStatus);
        }

        if ($dateCreated) {
            // Extract the date
            list($startDate, $endDate) = explode(' - ', $dateCreated);
            Log::error('startDate,', ['startDate,' => $startDate,]);
            Log::error('endDate', ['endDate' => $endDate]);

            $query->whereBetween('users.created_at', [$startDate, $endDate]);
        }

        $faculties = $query
            ->orderBy('faculties.id', 'asc')
            ->paginate($entriesPerPage)
            ->withQueryString();

        if (request()->expectsJson()) {
            return response()->json($faculties);
        }

        return Inertia::render('InstitutionAdmin/Faculties/Faculties', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            'retrievedFaculties' => $faculties,
            'hasFacultyPremiumAccess' => $hasFacultyPremiumAccess,
            'retrievedEntriesPerPage' => $entriesPerPage,
            'retrievedSearchName' => $search,
        ]);
    }

    public function setPlanStatus($hasFacultyPremiumAccess)
    {
        $userId = request('user_id');
        $personalPlan = PersonalSubscription::firstWhere('user_id', $userId);
        $personalPlan->persub_status = $personalPlan->persub_status === 'active' ? 'deactivated' : 'active';

        $personalPlan->save();

        return  $this->filter($hasFacultyPremiumAccess);
    }

    public function addFaculty()
    {
        $validatedData = request()->validate(
            [
                'faculty_id' => 'required|integer|unique:faculties,id',
                'department_id' => 'required|integer',
                'name' => 'required|string|max:255',
                'department.origText' => 'required|string|max:100',
                'email' => 'required|email|max:255|unique:users,email',
            ],
            [],
            [
                // Custom attribute names
                'department.origText' => 'department',
            ]
        );

        Log::info('dept_id', ['deptId' => $validatedData['department_id']]);


        DB::beginTransaction();

        try {
            // Create the user
            $user = User::create([
                'user_type' => 'student',
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => 'AA' . $validatedData['email'] . '44',
            ]);

            // Create the student
            Faculty::create([
                'id' => $validatedData['faculty_id'],
                'user_id' => $user->id,
                'uni_branch_id' => $this->insAdminUniBranchId,
                'dept_id' => $validatedData['department_id'],
            ]);

            DB::commit(); // Commit the transaction if everything is fine
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction on error
            Log::error($e->getMessage());
            return back()->withErrors(['error' => 'Failed to add student: ' . $e->getMessage()]);
        }
    }
}