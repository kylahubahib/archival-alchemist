<?php

namespace App\Http\Controllers\Pages\InstitutionAdmin;

use App\Mail\AccountDetailsMail;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Models\{PersonalSubscription, Student, User, UserLog};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Concerns\ToArray;

class StudentController extends Controller
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

    public function filter($hasStudentPremiumAccess)
    {
        $search = request('search', null);

        Log::info(['search' => $search]);

        $department = request('department', null);
        $course = request('course', null);
        $section = request('section', null);
        $dateCreated = request('date_created', null);
        $entries = (int) request('entries', 10);

        $query = User::where('user_type', 'student') // Only students
            ->select('id', 'uni_id_num', 'name', 'email', 'is_premium', 'is_affiliated', 'user_pic', 'created_at', 'user_status');

        // Filter premium access
        if ($hasStudentPremiumAccess === 'with-premium-access') {
            $query->where('is_premium', true);
        } elseif ($hasStudentPremiumAccess === 'no-premium-access') {
            $query->where('is_premium', false);
        }

        $query->where('is_affiliated', true);

        $query->with([
            'student:id,user_id,section_id,uni_branch_id',
            'student.university_branch:id,uni_id,uni_branch_name',
            'student.university_branch.university:id,uni_name,uni_acronym',
            'student.section:id,course_id,section_name',
            'student.section.course:id,course_name,course_acronym,dept_id',
            'student.section.course.department:id,dept_name,dept_acronym,uni_branch_id',
        ]);

        // Filter by related university branch
        $query->whereHas('student', function ($q) {
            $q->where('uni_branch_id', $this->insAdminUniBranchId);
        });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%');
                $q->orWhere('email', 'LIKE', '%' . $search . '%');
                $q->orWhere('uni_id_num', 'LIKE', '%' . $search . '%');
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

        if ($dateCreated) {
            [$startDate, $endDate] = explode(' - ', $dateCreated);
            $query->whereBetween('users.created_at', [$startDate, $endDate]);
        }

        $students = $query
            ->whereHas('student', function ($q) {
                $q->orderBy('id', 'asc');
            })
            ->paginate($entries)
            ->withQueryString();

        if (request()->expectsJson()) {
            return response()->json($students);
        }

        return Inertia::render('InstitutionAdmin/Students/Students', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            'students' => $students,
            'hasStudentPremiumAccess' => $hasStudentPremiumAccess,
            'totalAffiliatedPremiumUsers' => $this->totalAffiliatedPremiumUsers,
            'planUserLimit' => $this->planUserLimit,
            'entries' => $entries,
            'search' => $search,
        ]);
    }

    public function updatePremiumAccess(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'action' => 'required|in:Grant,Remove',
        ]);

        $userId = $validatedData['user_id'];
        $action = $validatedData['action'];

        // Retrieve the user to be updated
        $user = User::findOrFail($userId);

        // Keep track of the previous affiliation
        $previousIsPremiumVal = $user->is_premium;

        // Update is_premium based on action
        switch ($action) {
            case 'Grant':
                $user->is_premium = true;
                break;

            case 'Remove':
                $user->is_premium = false;
                break;
        }

        // Check if the plan user limit has been reached before granting institution premium access
        if ($action === 'Grant' && $this->totalAffiliatedPremiumUsers >= $this->planUserLimit) {
            return back()->with('error', 'Premium access update failed. The plan user limit has been reached.');
        }

        // Save the updated user
        $user->save();

        // Log the activity
        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => "Update " . ucfirst($user->user_type) . " institution premium Access",
            'log_activity_content' => "Updated {$user->user_type} instititution premium access for <strong>{$user->name}</strong> from <strong>{$previousIsPremiumVal}</strong> to <strong>{$user->is_premium}</strong>.",
        ]);

        return back()->with('success', 'Premium access updated successfully.');
    }

    public function addStudent(Request $request)
    {
        // Check if the plan user limit has been reached before granting institution premium access
        if ($this->totalAffiliatedPremiumUsers >= $this->planUserLimit) {
            return back()->with('error', 'Unable to add student. The plan user limit has been reached.');
        }

        // Validate the student data
        $validatedData = $request->validate(
            [
                'uni_id_num' => [
                    'required',
                    'string',
                    'max:20',
                    // Check if the uni_id_num already exists within the university
                    function ($attribute, $value, $fail) {
                        $exists = Student::where('uni_branch_id', $this->insAdminUniBranchId)
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
                'uni_id_num' => 'university student ID',
            ]
        );

        $password = 'AA' . $validatedData['date_of_birth'] . '44'; // Plain password for email
        $hashedPassword = Hash::make($password); // Hash the password for storing in the database
        $loginPageLink = route('login');

        DB::beginTransaction();

        try {
            // Create the user
            $user = User::create([
                'user_pic' => 'storage/profile_pics/default_pic.png',
                'user_type' => 'student',
                'name' => $validatedData['name'],
                'uni_id_num' => $validatedData['uni_id_num'],
                'user_dob' => $validatedData['date_of_birth'],
                'email' => $validatedData['email'],
                'password' => $hashedPassword,
                'is_affiliated' => true,
                'is_premium' => true,
            ]);

            // Create the student
            Student::create([
                'user_id' => $user->id,
                'uni_branch_id' => $this->insAdminUniBranchId,
            ]);

            // Log the activity
            UserLog::create([
                'user_id' => Auth::id(),
                'log_activity' => 'Added Student',  // Concise activity type
                'log_activity_content' => "Added student <strong>{$validatedData['name']}</strong> with university ID <strong>{$validatedData['uni_id_num']}</strong> and email <strong>{$validatedData['email']}</strong>.", // Detailed content
            ]);

            DB::commit(); // Commit the transaction if everything is fine

            // Send the student account details via email
            Mail::to($validatedData['email'])->send(new AccountDetailsMail(
                'student',
                $validatedData['name'],
                $validatedData['email'],
                $password,
                $loginPageLink
            ));
            return redirect()->back()->with('success', 'Student added successfully!');
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction on error
            return redirect()->back()->with('error', 'Failed to add student: ' . $e->getMessage());
        }
    }
}
