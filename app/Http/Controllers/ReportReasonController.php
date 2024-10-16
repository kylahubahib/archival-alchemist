<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ReportType;
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

        return redirect(route('manage-report-reason.index'))->with('success', 'Report reason created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {

        $request->validate([
            'report_type_content' => 'required|string|max:1000'
        ], [], [
            'report_type_content' => 'report reason',
        ]);

        $data = ReportType::find($id);

        $data->update([
            'user_id' => Auth::id(),
            'report_type_content' => $request->report_type_content
        ]);

        return redirect(route('manage-report-reason.index'))->with('success', 'Report Reason updated successfully.');

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        ReportType::find($id)->delete();

        return redirect(route('manage-report-reason.index'))->with('success', 'Report reason deleted successfully.');
    }

}
