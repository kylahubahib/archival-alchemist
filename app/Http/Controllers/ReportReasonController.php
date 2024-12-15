<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ReportType;
use App\Models\UserLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class ReportReasonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $reportReason = ReportType::with('user')
            ->paginate(100);

        return Inertia::render('SuperAdmin/Advanced/ReportReason/ReportReason', [
            'reportReason' => $reportReason
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'report_type_content' => 'required|string|max:1000'
        ], [], [
            'report_type_content' => 'report reason',
        ]);


        ReportType::create([
            'user_id' => Auth::id(),
            'report_type_content' => $request->report_type_content
        ]);

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Created Report Reason',
            'log_activity_content' => "Created a new report reason <strong>{$request->report_type_content}</strong>.",
        ]);

        return redirect(route('manage-report-reason.index'))->with('success', 'Report reason created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {

        $request->validate(
            //Validation rules
            ['report_type_content' => 'required|string|max:1000'],
            // Custom error messages
            [],
            //Custom attribute name for the error messages
            // Example: The report type content is required turns to The report reason is required.
            ['report_type_content' => 'report reason',]
        );

        $data = ReportType::find($id);
        $oldContent = $data->report_type_content;

        $data->update([
            'user_id' => Auth::id(),
            'report_type_content' => $request->report_type_content
        ]);

        $newContent = $request->report_type_content;

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Updated Report Reason',
            'log_activity_content' => "Updated the report reason from <strong>{$oldContent}</strong> to <strong>{$newContent}</strong>.",
        ]);

        return redirect(route('manage-report-reason.index'))->with('success', 'Report Reason updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        $reportType = ReportType::find($id);

        $deletedContent = $reportType->report_type_content;

        ReportType::find($id)->delete();

        UserLog::create([
            'user_id' => Auth::id(),
            'log_activity' => 'Deleted Report Reason',
            'log_activity_content' => "Deleted the report reason <strong>{$deletedContent}</strong>.",
        ]);

        return redirect(route('manage-report-reason.index'))->with('success', 'Report reason deleted successfully.');
    }
}
