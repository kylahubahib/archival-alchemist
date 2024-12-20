<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccessControl;
use App\Models\Course;
use App\Models\Department;
use App\Models\University;
use App\Models\UniversityBranch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FetchDataController extends Controller
{
    public function fetchUniversities()
    {
        $universities = University::pluck('uni_name');

        return response()->json($universities);
    }

    public function fetchUniversitiesWithBranches()
    {
        $universities = University::with('university_branch')->get();

        return response()->json($universities);
    }

    public function fetchDistinctDepartments()
    {
        $departments = Department::distinct()->pluck('dept_name');

        return response()->json($departments);
    }

    public function fetchDepartmentsWithCourses()
    {
        $departments = Department::with('course')->get();

        return response()->json($departments);
    }

    public function fetchDistinctUserStatus()
    {
        $status = User::distinct()->get(['user_status'])->pluck('user_status');

        $capitalizedStatus = $status->map(function ($status) {
            return ucwords($status);
        });

        return response()->json($capitalizedStatus);
    }

    public function fetchDistinctCurrentPlans()
    {
        $users = User::distinct()->get(['is_premium'])->pluck('is_premium');

        $currentPlan = $users->map(function ($isPremium) {
            return $isPremium ? 'Premium' : 'Basic';
        });

        return response()->json($currentPlan);
    }

    public function fetchRelatedDataForUniversity(Request $request)
    {
        $uniName = $request->get('university');

        // Get the uni_id since this is the FK on the university_branches table
        $uniId = University::where('uni_name', $uniName)->value('id');

        // Fetch related data
        $universityRelatedData = UniversityBranch::where('uni_id', $uniId)
            ->select(['uni_branch_id', 'uni_branch_name'])
            ->with([
                'department:id,dept_name,uni_branch_id',
                'department.course:id,course_name,dept_id',
            ])
            ->get();

        return response()->json($universityRelatedData);
    }

    // public function fetchRelatedBranchesForUniversity(Request $request)
    // {
    //     $uniName = $request->get('university');
    //     // Gets the uni_id since this is the fk on university_branches table
    //     $uniId = University::where('uni_name', $uniName)->value('uni_id');
    //     $branches = UniversityBranch::where('uni_id', $uniId)->pluck('uni_branch_name');

    //     return response()->json($branches);
    // }

    // public function fetchRelatedCoursesForDepartment(Request $request)
    // {
    //     $deptName = $request->get('department');
    //     $deptId = Department::where('dept_name', $deptName)->distinct()->value('dept_id');
    //     $courses = Course::where('dept_id', $deptId)->pluck('course_name');

    //     return response()->json($courses);
    // }

    public function fetchSuperAdminRoles()
    {
        $ids = User::where('user_type', 'superadmin')->pluck('id');
        \Log::info('Superadmin IDs:', $ids->toArray()); // Debugging

        $roles = AccessControl::whereIn('user_id', $ids)->distinct()->pluck('role');
        \Log::info('Superadmin Roles:', $roles->toArray()); // Debugging

        $formattedRoles = [
            'super_admin' => 'Super Admin',
            'co_super_admin' => 'Co-Super Admin',
        ];

        $responseRoles = $roles->map(function ($role) use ($formattedRoles) {
            return $formattedRoles[$role] ?? $role;
        });

        return response()->json($responseRoles);
    }

    public function fetchInstitutionAdminRoles()
    {
        // Fetch user IDs of institution admins
        $ids = User::where('user_type', 'admin')->pluck('id');
        \Log::info('Institution Admin IDs:', $ids->toArray()); // Debugging

        // Fetch distinct roles associated with those user IDs
        $roles = AccessControl::whereIn('user_id', $ids)->distinct()->pluck('role');
        \Log::info('Institution Admin Roles:', $roles->toArray()); // Debugging

        // Map roles to formatted values
        $formattedRoles = [
            'institution_admin' => 'Institution Admin',
            'co_institution_admin' => 'Co-Institution Admin',
        ];

        $responseRoles = $roles->map(function ($role) use ($formattedRoles) {
            return $formattedRoles[$role] ?? $role;
        });

        return response()->json($responseRoles);
    }


    public function fetchUniversityRelatedData()
    {
        $universities = University::with('university_branch.department.course.sections')->get();

        return response()->json($universities);
    }
}
