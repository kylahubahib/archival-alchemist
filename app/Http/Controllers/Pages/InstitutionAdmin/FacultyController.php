<?php

namespace App\Http\Controllers\Pages\InstitutionAdmin;

use App\Http\Controllers\Controller;
use App\Mail\AccountDetailsMail;
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Models\{Faculty, PersonalSubscription, User};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
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
        // $course = request('course', null);
        $plan = request('plan', null);
        $planStatus = request('plan_status', null);
        $dateCreated = request('date_created', null);
        $entries = (int) request('entries', 10);

        $query = User::where('user_type', 'teacher') // Only students
            ->select('id', 'uni_id_num', 'name', 'email', 'is_premium', 'user_pic', 'created_at', 'user_status');

        // Filter premium access
        if ($hasFacultyPremiumAccess === 'with-premium-access') {
            $query->where('users.is_premium', true);
        } elseif ($hasFacultyPremiumAccess === 'no-premium-access') {
            $query->where('users.is_premium', false);
        }

        $query->with([
            'faculty:id,user_id,course_id,uni_branch_id',
            'faculty.university_branch:id,uni_id,uni_branch_name',
            'faculty.university_branch.university:id,uni_name,uni_acronym',
            'faculty.course:id,dept_id',
            'faculty.course.section:id,course_id,section_name',
            'faculty.course.department:id,dept_name,dept_acronym,uni_branch_id',
            'personal_subscription:id,user_id,plan_id,start_date,end_date,persub_status',
            'personal_subscription.plan:id,plan_name,plan_type,plan_term',
        ]);

        // Filter by related university branch
        $query->whereHas('faculty', function ($q) {
            $q->where('uni_branch_id', $this->insAdminUniBranchId);
        });

        // Filter by subscription plan type
        // $query->whereHas('personal_subscription.plan', function ($q) {
        //     $q->where('plan_type', 'Personal');
        // });

        // Search by user name or faculty ID
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('faculty', function ($q) use ($search) {
                        $q->where('id', 'LIKE', '%' . $search . '%');
                    });
            });
        }

        // Filter by department
        if ($department) {
            $query->whereHas('faculty.course.department', function ($q) use ($department) {
                $q->where('dept_acronym', $department);
            });
        }

        // Filter by course
        // if ($course) {
        //     $query->whereHas('faculty.course', function ($q) use ($course) {
        //         $q->where('course_acronym', $course);
        //     });
        // }

        // Filter by subscription plan name
        if ($plan) {
            $query->whereHas('personal_subscription.plan', function ($q) use ($plan) {
                $q->where('plan_name', $plan);
            });
        }

        // Filter by subscription status
        if ($planStatus) {
            $query->whereHas('personal_subscription', function ($q) use ($planStatus) {
                $q->where('persub_status', $planStatus);
            });
        }

        // Filter by creation date range
        if ($dateCreated) {
            [$startDate, $endDate] = explode(' - ', $dateCreated);
            $query->whereBetween('users.created_at', [$startDate, $endDate]);
        }
        $faculties = $query
            // ->whereHas('faculty', function ($q) {
            //     $q->orderBy('id', 'asc');
            // })
            ->paginate($entries)
            ->withQueryString();

        if (request()->expectsJson()) {
            return response()->json($faculties);
        }

        return Inertia::render('InstitutionAdmin/Faculties/Faculties', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            'faculties' => $faculties,
            'hasFacultyPremiumAccess' => $hasFacultyPremiumAccess,
            'entries' => $entries,
            'search' => $search,
        ]);
    }

    public function updatePlanStatus(Request $request, $hasFacultyPremiumAccess)
    {
        $userId = $request->input('user_id');
        $action = $request->input('action');

        $personalPlan = PersonalSubscription::firstWhere('user_id', $userId);

        Log::info(['action' => $action]);


        switch ($action) {
            case 'Activate':
                $personalPlan->persub_status = 'Active';
                break;

            case 'Deactivate':
                $personalPlan->persub_status = 'Deactivated';
                break;

            default:
                return response()->json(['error' => 'Invalid action'], 400);
        }

        $personalPlan->save();

        return  $this->filter($hasFacultyPremiumAccess);
    }

    public function addFaculty(Request $request)
    {
        // Validate the student data
        $validatedData = $request->validate(
            [
                'uni_id_num' => [
                    'required',
                    'string',
                    'max:20',
                    // Check if the uni_id_num already exists within the university
                    function ($attribute, $value, $fail) {
                        $exists = Faculty::where('uni_branch_id', $this->insAdminUniBranchId)
                            ->whereHas('user', function ($query) use ($value) {
                                $query->where('uni_id_num', $value);
                            })
                            ->exists();

                        if ($exists) {
                            $fail('The university ID is already in use.');
                        }
                    },
                ],
                'name' => 'string|max:255',
                'email' => 'required|email|max:255|unique:users,email',
                'date_of_birth' => 'required|max:150',
            ],
            [],
            [
                'uni_id_num' => 'university ID',
            ]
        );

        $password = 'AA' . $validatedData['date_of_birth'] . '44'; // Plain password for email
        $hashedPassword = Hash::make($password); // Hash the password for storing in the database
        $loginPageLink = route('login');

        $user = User::where('email', $validatedData['name']);

        DB::beginTransaction();

        try {
            // Create the user
            $user = User::create([
                'user_pic' => 'storage/profile_pics/default_pic.png',
                'user_type' => 'teacher',
                'name' => $validatedData['name'],
                'uni_id_num' => $validatedData['uni_id_num'],
                'user_dob' => $validatedData['date_of_birth'],
                'email' => $validatedData['email'],
                'password' => $hashedPassword, // Store the hashed password
            ]);

            // Create the student
            Faculty::create([
                'user_id' => $user->id,
                'uni_branch_id' => $this->insAdminUniBranchId,
            ]);

            DB::commit(); // Commit the transaction if everything is fine

            // Send the student account details via email
            Mail::to($validatedData['email'])->send(new AccountDetailsMail(
                'faculty',
                $validatedData['name'],
                $validatedData['email'],
                $password,
                $loginPageLink
            ));

            return response()->json([
                'success' => true,
                'message' => 'Faculty added successfully!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction on error
            return response()->json([
                'success' => false,
                'message' => 'Failed to add faculty: ' . $e->getMessage(),
            ], 500);
        }
    }
}
