<?php

namespace App\Http\Controllers\Pages\InstitutionAdmin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Models\{PersonalSubscription, Student, User};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentController extends Controller
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

    public function filter($hasStudentPremiumAccess)
    {
        $search = request('search', null);
        $department = request('department', null);
        $course = request('course', null);
        $plan = request('plan', null);
        $planStatus = request('plan_status', null);
        $dateCreated = request('date_created', null);
        $entriesPerPage = (int) request('entries', 10);

        $query = DB::table('users')
            ->join('students', 'users.id', '=', 'students.user_id')
            ->join('university_branches', 'students.uni_branch_id', '=', 'university_branches.id')
            ->leftJoin('class_students', 'students.id', '=', 'class_students.stud_id')
            ->leftJoin('class', 'class_students.class_id', '=', 'class.id')
            ->leftJoin('sections', 'class.section_id', '=', 'sections.id')
            ->leftJoin('courses', 'sections.course_id', '=', 'courses.id')
            ->leftJoin('departments', 'courses.dept_id', '=', 'departments.id')
            ->leftJoin('personal_subscriptions', 'users.id', '=', 'personal_subscriptions.user_id')
            ->leftJoin('subscription_plans', 'personal_subscriptions.plan_id', '=', 'subscription_plans.id')
            ->select(
                'users.name',
                'users.created_at',
                'users.email',
                'users.is_premium',
                'users.user_pic',
                'users.user_status',
                'students.id',
                'departments.dept_acronym',
                'courses.course_acronym',
                'sections.section_name',
                'subscription_plans.plan_name',
                'personal_subscriptions.start_date',
                'personal_subscriptions.end_date',
                'personal_subscriptions.persub_status',
            )
            ->where('university_branches.id', $this->insAdminUniBranchId);

        if ($hasStudentPremiumAccess === 'with-premium-access') {
            $query->where('users.is_premium', true);
        } elseif ($hasStudentPremiumAccess === 'no-premium-access') {
            $query->where('users.is_premium', false);
        }

        if ($search) {
            // Proper way to have multiple where statements is to wrap it in the closure or a function
            // to avoid canceling out the next where queries
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'LIKE', '%' . $search . '%')
                    ->orWhere('students.id', 'LIKE', '%' . $search . '%');
            });
        }

        if ($department) {
            $query->where('departments.dept_name', $department);
        }

        if ($course) {
            $query->where('courses.course_name', $course);
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

        $students = $query
            ->orderBy('students.id', 'asc')
            ->paginate($entriesPerPage)
            ->withQueryString();

        if (request()->expectsJson()) {
            return response()->json($students);
        }

        return Inertia::render('InstitutionAdmin/Students/Students', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            'retrievedStudents' => $students,
            'hasStudentPremiumAccess' => $hasStudentPremiumAccess,
            'retrievedEntriesPerPage' => $entriesPerPage,
            'retrievedSearchName' => $search,
        ]);
    }

    public function setPlanStatus($hasStudentPremiumAccess)
    {
        $userId = request('user_id');
        $personalPlan = PersonalSubscription::firstWhere('user_id', $userId);
        $personalPlan->persub_status = $personalPlan->persub_status === 'active' ? 'deactivated' : 'active';

        $personalPlan->save();

        return  $this->filter($hasStudentPremiumAccess);
    }

    public function addStudent()
    {
        $validatedData = request()->validate(
            [
                'student_id' => 'required|integer|unique:students,id',
                'department_id' => 'required|integer',
                'course_id' => 'required|integer',
                'name' => 'required|string|max:255',
                'department.origText' => 'required|string|max:100',
                'course.origText' => 'required|string|max:100',
                'email' => 'required|email|max:255|unique:users,email',
            ],
            [],
            [
                // Custom attribute names
                'department.origText' => 'department',
                'course.origText' => 'course',
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
            Student::create([
                'id' => $validatedData['student_id'],
                'user_id' => $user->user_id,
                'uni_branch_id' => $this->insAdminUniBranchId,
                'dept_id' => $validatedData['department_id'],
                'course_id' => $validatedData['course_id'],
            ]);

            DB::commit(); // Commit the transaction if everything is fine
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction on error
            // Log::error($e->getMessage());
            return back()->withErrors(['error' => 'Failed to add student: ' . $e->getMessage()]);
        }
    }
}