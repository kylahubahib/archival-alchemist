<?php

namespace App\Http\Controllers;

use App\Models\ReportType;
use App\Models\UserReport;
use App\Models\User;
use App\Models\ForumPost;
// use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth; 

use App\Notifications\SuperadminNotification;
use App\Notifications\InstitutionAdminNotification;
use App\Notifications\UserNotification;

class UserReportController extends Controller
{
    /** 
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->deleteOldReports();

        $userReports = UserReport::with('user')->paginate(100);

        $allReportCount = UserReport::count();
        $pendingCount = UserReport::where('report_status', 'Pending')->count();
        $solvedCount = UserReport::where('report_status', 'Solved')->count();
        $droppedCount = UserReport::where('report_status', 'Dropped')->count();

        $reportLocation = UserReport::distinct()->pluck('report_location');

        //\Log::info($reportLocation->toArray());
        //\Log::info($userReports->toArray());

        return Inertia::render('SuperAdmin/UserReports/UserReports', [
            'userReports' => $userReports,
            'allReportCount' => $allReportCount,
            'pendingCount' => $pendingCount,
            'solvedCount' => $solvedCount,
            'droppedCount' => $droppedCount,
            'reportLocation' => $reportLocation

        ]);

    }

    private function deleteOldReports()
    {
        $thresholdDate = now()->subDays(30); 
        $oldReports = UserReport::where('created_at', '<', $thresholdDate)->delete();

        \Log::info("Deleted $oldReports old reports older than 30 days.");
    }


    public function filterReports(Request $request)
    {
        $status = $request->get('report_status');
        $date = $request->get('report_date');
        $location = $request->get('report_location');

        $reports = UserReport::with('user');

        if ($status != 'All') {
            $reports->where('report_status', $status);
        }

        if($location != 'All') {
            $reports->where('report_location', $location);
        }

        \Log::info('Date:'. $date);
        \Log::info('Date Today: ' . Carbon::today());
        //\Log::info(UserReport::distinct()->pluck('created_at'));

        if ($date != 'All') {
            switch ($date) {
                case 'Today':
                    //This method is used to compare a specific date (without considering the time).
                    $reports->whereDate('created_at', Carbon::today());
                    break;
                case 'This Week':
                    //This method is used to filter records where a field's value is between two values, including the bounds. 
                    //It works for numeric, string, and date fields.
                    $reports->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                    break;
                case 'This Month':
                    //The whereMonth is used to filter records by the month of a specific date field
                    //The whereYear ensures that only reports from the current year are considered.
                    $reports->whereYear('created_at', Carbon::now()->year)
                            ->whereMonth('created_at', Carbon::now()->month);
                    break;
            }
        }

        //\Log::info('Filtered Reports Query: ', ['query' => $reports->toSql()]);

        $filteredReports = $reports->get();
        //\Log::info($filteredReports->toArray());

        return response()->json($filteredReports);
    }



    public function reportTypeList()
    {
        $reportTypes = ReportType::all();

        return response()->json($reportTypes);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $report = UserReport::with('user:id,name,user_status,user_pic')->find($id);
        $reportedCount = 0;

        if (!$report) {
            return redirect()->back()->with('error', 'Report not found.');
        }

        switch ($report->report_location) {  
            case 'Forum':
                $content = ForumPost::with('user:id,name,user_status,user_pic')->find($report->reported_id); 
                break;

            case 'Profile':
                $content = User::find($report->reported_id); 
                $reportedCount = UserReport::where('reported_id', $report->reported_id)->count();
                break;

            default:
                break;
        }

        return response()->json([
            'report' => $report,
            'content' => $content,
            'reportedCount' => $reportedCount
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Log::info('This is the report');

        // Validate request
        $request->validate([
            'reported_id' => 'required|integer|min:0',
            'report_type' => 'required|string',
            // 'report_attachment' => 'nullable|string',
            'report_desc' => 'required|string',
            'report_location' => 'required|string',
        ]);

        try {
            $existingReport = UserReport::where('reporter_id', Auth::id())
                ->where('reported_id', $request->reported_id)
                ->where('report_location', $request->report_location)
                ->first();

            if ($existingReport) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already submitted a report.'
                ], 409);
            }

            $report = UserReport::create([
                'reporter_id' => Auth::id(),
                'reported_id' => $request->reported_id,
                'report_type' => $request->report_type,
                'report_attachment' => $request->report_attachment,
                'report_desc' => $request->report_desc,
                'report_location' => $request->report_location,
            ]);

            \Log::info($report->toArray());

            if($report)
            {
                $superadmins = User::where('user_type', 'superadmin')->get();
            
                //Notify the superadmin for the newly registered institution admin
                if ($superadmins->isNotEmpty()) {
                    foreach ($superadmins as $superadmin) {
                        $superadmin->notify(new SuperadminNotification([
                            'message' => 'A new user report has been submitted. Please review the report to take the necessary action.',
                            'admin_id' => $superadmin->id,
                        ]));
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Report submitted successfully!'
            ]);

        } catch (\Exception $e) {

            \Log::error('Error creating report: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit report. Please try again.'
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $report = UserReport::find($id);

        if (!$report) {
            return redirect()->back()->with('error', 'Report not found.');
        }

        $status = $request->get('status');
        $duration = (int) $request->get('duration');
        $reportedId = $request->get('reportedId');
        $end_date = Carbon::now()->addDays($duration);

        switch ($report->report_location) {  
            case 'Forum':
                $content = ForumPost::find($report->reported_id);

                if ($content) {
                    \Log::info('Content: ', $content->toArray());
                
                    $content->update([
                        'status' => 'Hidden',
                    ]);

                    $user = User::find($content->user_id);
                    if ($user) {
                        $user->update([
                            'user_status' => 'Suspended'
                        ]);
                    }

                    $report->update([
                        'report_status' => 'Solved',  
                        'suspension_start_date' => Carbon::now(),
                        'suspension_end_date' => $end_date,
                        'closed_at' => Carbon::now()
                    ]);
                }
                break;

            case 'Profile':

                $user = User::find($report->reported_id);
                if ($user) {
                    $user->update([
                        'user_status' => 'Suspended'
                    ]);

                }

                $report->update([
                    'report_status' => 'Solved',  
                    'suspension_start_date' => Carbon::now(),
                    'suspension_end_date' => $end_date,
                    'closed_at' => Carbon::now()
                ]);
                break;

            default:
                break;
        }

        $reporter = User::find($report->reporter_id);

        if($reporter) {
            $reporter->notify(new UserNotification([
                'message' => 'Hello ' . $reporter->name. ', we wanted to inform you that action has been taken regarding your 
                recent report on ' . $user->name . '. Thank you for helping us keep the Archival Alchemist community safe!',
                'user_id' => $reporter->id
            ]));
        }

      return response()->json([]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function warnUser(Request $request, string $id)
    {

        
        $report = UserReport::find($id);

        if (!$report) {
            return redirect()->back()->with('error', 'Report not found.');
        }

        $status = $request->get('status');
        $reportedUser = $request->get('reportedUser');;

                
        $user = User::find($reportedUser);
        \Log::info($user);

        if ($user) {
            $user->notify(new UserNotification([
                'message' => 'Hello ' . $user->name . ', we received a report about your recent activity on Archival Alchemist. 
                After reviewing it, we could not find enough evidence to substantiate a violation. However, we encourage you 
                to review our community guidelines and ensure that all interactions align with them to maintain a safe and positive 
                environment.',
                'user_id' => $user->id
            ]));
        }

        $report->update([
            'report_status' => 'Dropped',
            'closed_at' => Carbon::now()
        ]);
                

        return response()->json();
    }
}
