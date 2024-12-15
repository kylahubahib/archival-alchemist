<?php

namespace App\Http\Controllers\Pages\InstitutionAdmin;

use Illuminate\Http\Request;
use App\Mail\AccountDetailsMail;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Models\{ManuscriptProject, ManuscriptTag, PersonalSubscription, Student, User};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CoAdminController extends Controller
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
        $role = request('role', null);
        $status = request('status', null);
        $search = request('search', null);
        Log::info(['search' => $search]);
        $entries = request('entries', null);

        // Base query to get the users
        $query = User::where('user_type', 'admin')
            ->select('id', 'name', 'email', 'is_premium', 'user_pic', 'created_at', 'user_status');

        $query->with([
            'student:id,user_id,section_id,uni_branch_id',
        ]);

        $query->with([
            'access_control:access_id,user_id,role',
        ]);

        $query->whereHas('access_control', function ($q) {
            $q->where('uni_branch_id', $this->insAdminUniBranchId);
        });

        // Filters
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('id', $search); // Use orWhere here
            });
        }

        $coAdmins = $query->latest()->paginate($entries);

        if (request()->expectsJson()) {
            return response()->json($coAdmins);
        }

        return Inertia::render('InstitutionAdmin/CoAdmin/CoAdmin', [
            'insAdminAffiliation' => $this->insAdminAffiliation,
            'coAdmins' => $coAdmins,
            'totalAffiliatedPremiumUsers' => $this->totalAffiliatedPremiumUsers,
            'planUserLimit' => $this->planUserLimit,
            'entries' => $entries,
            'search' => $search,
        ]);
    }
}
