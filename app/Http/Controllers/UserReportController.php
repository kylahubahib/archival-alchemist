<?php

namespace App\Http\Controllers;

use App\Models\ReportType;
use App\Models\UserReport;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth; 

class UserReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Log::info('This is the report');

        // Validate request
        $request->validate([
            'reported_id' => 'required|integer|min:0',
            'report_type' => 'required|string',
            'report_attachment' => 'nullable|string',
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

        switch ($report->report_location) {  
            case 'Forum':
                // 
                break;

            case 'Chat':
                // 
                break;

            default:
                break;
        }

        $report->update([
            'report_status' => $status,  
        ]);

        return redirect(route('user-reports.index'))->with('success', 'Report status updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
