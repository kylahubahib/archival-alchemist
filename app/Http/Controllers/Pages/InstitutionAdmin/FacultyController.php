<?php

namespace App\Http\Controllers\Pages\InstitutionAdmin;

use App\Http\Controllers\Controller;
use App\Mail\AccountDetailsMail;
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Models\{Faculty, PersonalSubscription, eser, UserLog};
use App\Models\User;
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
    protected $totalAffiliatedPremiumUsers;
    protected $planUserLimit;

    public function __construct()
    {
        // Create an instance of CommonDataController to get the needed values
        $commonData = new InsAdminCommonDataController();
        $this->authUserId = Auth::id();
        $this->insAdminUniBranchId = $commonData->getInsAdminUniBranchId();
        $this->insAdminAffiliation = $commonData->getInsAdminAffiliation();
        $this->totalAffiliatedPremiumUsers = $commonData->getTotalAffiliatedPremiumUsers();
        $this->planUserLimit = $commonData->getPlanUserLimit();
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
        $dateCreated = request('date_created', null);
        $entries = (int) request('entries', 10);

        $query = User::where('user_type', 'teacher')
            ->select('id', 'uni_id_num', 'name', 'email', 'is_affiliated', 'is_premium', 'user_pic', 'created_at', 'user_status');

        // Filter premium access
        if ($hasFacultyPremiumAccess === 'with-premium-access') {
            $query->where('is_premium', true);
        } elseif ($hasFacultyPremiumAccess === 'no-premium-access') {
            $query->where('is_premium', false);
        }

        $query->where('is_affiliated', true);

        $query->with([
            'faculty:id,user_id,course_id,uni_branch_id',
            'faculty.university_branch:id,uni_id,uni_branch_name',
            'faculty.university_branch.university:id,uni_name,uni_acronym',
            'faculty.course:id,dept_id',
            'faculty.course.sections:id,course_id,section_name',
            'faculty.course.department:id,dept_name,dept_acronym,uni_branch_id',
        ]);

        // Filter by related university branch
        $query->whereHas('faculty', function ($q) {
            $q->where('uni_branch_id', $this->insAdminUniBranchId);
        });

        // Search by user name or faculty ID
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%');
                $q->orWhere('email', 'LIKE', '%' . $search . '%');
                $q->orWhere('uni_id_num', 'LIKE', '%' . $search . '%');
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
        //

        // Filter by creation date range
        if ($dateCreated) {
            [$startDate, $endDate] = explode(' - ', $dateCreated);
            $query->whereBetween('users.created_at', [$startDate, $endDate]);
        }
        $faculties = $query
            ->whereHas('faculty', function ($q) {
                $q->orderBy('id', 'asc');
            })
            ->paginate($entries)
            ->withQueryString();

        if (request()->expectsJson()) {
            return response()->json($faculties);
        }

        return Inertia::render('InstitutionAdmin/Faculties/Faculties', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            'faculties' => $faculties,
            'hasFacultyPremiumAccess' => $hasFacultyPremiumAccess,
            'totalAffiliatedPremiumUsers' => $this->totalAffiliatedPremiumUsers,
            'planUserLimit' => $this->planUserLimit,
            'entries' => $entries,
            'search' => $search,
        ]);
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
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email',
                'date_of_birth' => 'required|max:150',
            ],
            [],
            [
                'uni_id_num' => 'university faculty ID',
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
                'password' => $hashedPassword,
                'is_affiliated' => true,
                'is_premium' => true,
            ]);

            // Create the student
            Faculty::create([
                'user_id' => $user->id,
                'uni_branch_id' => $this->insAdminUniBranchId,
            ]);

            // Log the activity
            UserLog::create([
                'user_id' => Auth::id(),
                'log_activity' => 'Added Faculty',
                'log_activity_content' => "Added faculty <strong>{$validatedData['name']}</strong> with university ID <strong>{$validatedData['uni_id_num']}</strong> and email <strong>{$validatedData['email']}</strong>.",
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

            return redirect()->back()->with('success', 'Faculty added successfully!');
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction on error

            return redirect()->back()->with('error', 'Failed to add faculty: ' . $e->getMessage());
        }
    }
}
