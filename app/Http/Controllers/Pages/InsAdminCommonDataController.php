<?php

namespace App\Http\Controllers\Pages;

use App\Models\{Course, UniversityBranch, InstitutionAdmin, Department, PersonalSubscription, SubscriptionPlan};
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class InsAdminCommonDataController extends Controller
{

    protected $authUserId;
    protected $insAdminUniBranchId;
    protected $hasPremiumAccess;

    public function __construct()
    {
        $this->authUserId = Auth::id();
        $this->insAdminUniBranchId = $this->getInsAdminUniBranchId();
        $this->hasPremiumAccess = request('has_premium_access');
        // Log::info("Institution admin branch ID retrieved", ["branch_id" => $this->insAdminUniBranchId]);
    }
    public function getInsAdminAffiliation()
    {
        $affiliation = UniversityBranch::where('id', $this->insAdminUniBranchId)
            ->select('uni_id', 'uni_branch_name', 'id') // Add the fields you want to select
            ->with(['university:id,uni_name', 'institution_subscription']) // Eager load related data
            ->get(); // Execute the query and fetch results

        return $affiliation;
    }


    public function getInsAdminUniBranchId()
    {
        $insAdmin = InstitutionAdmin::where('user_id', $this->authUserId)->firstOrFail();
        $uniBranchId = $insAdmin->institution_subscription->uni_branch_id;
        // Log::info("ins admin branch id", ["insadmins branch id", $uniBranchId]);

        return $uniBranchId;
    }

    public function getDepartmentsWithCourses()
    {
        $departmentsWithCourses = Department::where('uni_branch_id', $this->insAdminUniBranchId)
            ->select('id', 'dept_name', 'dept_acronym')
            ->with('course:id,dept_id,course_name,course_acronym')
            ->get();

        return response()->json($departmentsWithCourses);
    }

    public function getPlansWithPlanStatus()
    {
        $plans = SubscriptionPlan::where('plan_type', '=', 'personal')
            ->distinct()
            ->pluck('plan_name');

        $planStatus = PersonalSubscription::select('persub_status')
            ->distinct()
            ->pluck('persub_status');


        // Combine the data into a single array or object
        $plansWithPlanStatus = [
            'plans' => $plans,
            'planStatus' => $planStatus
        ];

        return response()->json($plansWithPlanStatus);
    }

    public function getInsAdminNumbersOfUsersThatHeCan() {}
}
