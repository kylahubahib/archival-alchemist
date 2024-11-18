<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\ManuscriptProject;
use App\Models\PersonalSubscription;
use App\Models\InstitutionSubscription;
use App\Models\UniversityBranch;
use App\Models\Transaction;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userCounts = User::selectRaw('COUNT(CASE WHEN user_type = "student" THEN 1 END) as student_count, 
                    COUNT(CASE WHEN user_type = "teacher" THEN 1 END) as teacher_count, 
                    COUNT(CASE WHEN user_type = "admin" THEN 1 END) as insAdmin_count,
                    COUNT(CASE WHEN user_type != "superadmin" AND user_status = "active" THEN 1 END) as active_count,
                    COUNT(CASE WHEN user_type != "superadmin" AND user_status = "inactive" THEN 1 END) as inactive_count, 
                    COUNT(CASE WHEN is_premium = true THEN 1 END) as premium_count, 
                    COUNT(CASE WHEN is_premium = false THEN 1 END) as free_count')
                ->first();

        $usersData = [
            'labels' => ['Student', 'Teacher', 'Institution Admin'],
            'datasets' => [[
                'label' => 'Number of Users',
                'data' => [$userCounts->student_count, $userCounts->teacher_count, $userCounts->insAdmin_count],
                'backgroundColor' => [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                ],
                'hoverOffset' => 4
            ]]
        ];

        $subscriptionData = [
            'labels' => ['Premium', 'Free'],
            'datasets' => [[
            'label' => ['Number of Users',],
            'data' => [$userCounts->premium_count, $userCounts->free_count],
            'backgroundColor' => [
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)'
            ],
            'hoverOffset' => 4
            ]]
        ];

        //Get the 10 mauscripts with the most rating
        $topManuscripts = ManuscriptProject::orderBy('man_doc_rating', 'desc')
            ->limit(10)
            ->get();

        $currentYear = Carbon::now()->year;
        //Get the yearly revenue for institution subscription
        $institutionRev = Transaction::whereHas('user.institution_admin.institution_subscription')
            ->where('trans_status', 'paid')
            ->whereYear('created_at', $currentYear) 
            ->sum('trans_amount'); 
        $personalRev = Transaction::whereHas('user.personal_subscription')
            ->where('trans_status', 'paid')
            ->whereYear('created_at', $currentYear ) 
            ->sum('trans_amount'); 
        
        
        $counts = [
            'totalUsers' => $userCounts->student_count + $userCounts->teacher_count + $userCounts->insAdmin_count,
            'totalActiveUsers' => $userCounts->active_count,
            'totalInactiveUsers' =>  $userCounts->inactive_count,
            'totalPerSub' => PersonalSubscription::count(),
            'totalInSub' => InstitutionSubscription::count(),
            'uniCount' => UniversityBranch::count(),
            'manuscriptsCount' => ManuscriptProject::where('is_publish', true)->count()
        ];
        
        $monthlyData = $this->getMonthlyRevenue(); 
        //$yearlyData = $this->getYearlyRevenue(); 

        $revenue = [
            'totalMontlyRevenue' => $monthlyData['monthlyRevenue'],
            'totalAnnualRevenue' => $institutionRev + $personalRev
        ];

        $chartData = [
            'usersData' => $usersData,
            'subscriptionData' => $subscriptionData,
            'monthlyRevenueData' => $monthlyData['monthlyRevenueData'],
            'manuscriptCountWeekly' => $this->getWeeklyManuscript(),
        ];

        return Inertia::render('SuperAdmin/Dashboard/Dashboard', [
            'chartData' => $chartData,
            'topManuscripts' => $topManuscripts,
            'counts' => $counts ,
            'revenue' => $revenue,
        ]);
    }

    private function getMonthlyRevenue()
    {
        $personalMonthlyRevenue = Transaction::whereHas('user.personal_subscription')
            ->whereYear('created_at', Carbon::now()->year) 
            ->where('trans_status', 'paid') 
            ->selectRaw('MONTH(created_at) as month, SUM(trans_amount) as total')
            ->groupBy('month')
            ->get();

        $institutionMonthlyRevenue = Transaction::whereHas('user.institution_admin.institution_subscription')
            ->whereYear('created_at', Carbon::now()->year) 
            ->where('trans_status', 'paid')
            ->selectRaw('MONTH(created_at) as month, SUM(trans_amount) as total')
            ->groupBy('month')
            ->get();

        \Log::info($institutionMonthlyRevenue);

        $personalData = array_fill(0, 12, 0); // 12 months
        $institutionData = array_fill(0, 12, 0); // 12 months

        // Populate personal subscription data
        foreach ($personalMonthlyRevenue as $revenue) {
            $personalData[$revenue['month'] - 1] = $revenue['total'];
        }

        // Populate institutional subscription data
        foreach ($institutionMonthlyRevenue as $revenue) {
            $institutionData[$revenue['month'] - 1] = $revenue['total'];
        }


        $monthlyRevenueData = [
            'labels' => ['January','February','March','April','May','June','July','August','September','October','November','December'],
            'datasets' => [[
                'label' => 'Personal Subscription',
                'data' => $personalData,
                'borderColor' => 'rgb(54, 162, 235)',
                'tension' => 0.1
            ],[
                'label' => 'Institutional Subscription',
                'data' => $institutionData,
                'borderColor' => 'rgb(255, 99, 132)',
                'tension' => 0.1
            ]]];

        $monthlyRevenue = $institutionMonthlyRevenue->sum('total') + $personalMonthlyRevenue->sum('total');

        return [
            'monthlyRevenueData' => $monthlyRevenueData,
            'monthlyRevenue' => $monthlyRevenue 
        ];
    
    }

    public function getYearlyRevenue()
    {
        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 6; 

        // Yearly Revenue for Personal Subscription
        $personalYearlyRevenue = Transaction::whereHas('user.personal_subscription')
            ->whereBetween('created_at', [$startYear . '-01-01', $currentYear . '-12-31']) 
            ->where('trans_status', 'paid') 
            ->selectRaw('YEAR(created_at) as year, SUM(trans_amount) as total')
            ->groupBy('year')
            ->pluck('total', 'year'); 

        // Yearly Revenue for Institutional Subscription
        $institutionYearlyRevenue = Transaction::whereHas('user.institution_admin.institution_subscription')
            ->whereBetween('created_at', [$startYear . '-01-01', $currentYear . '-12-31'])
            ->where('trans_status', 'paid')
            ->selectRaw('YEAR(created_at) as year, SUM(trans_amount) as total')
            ->groupBy('year')
            ->pluck('total', 'year'); 

        // Initialize arrays for the last 7 years (including the current year)
        $years = range($startYear, $currentYear);
        $personalData = array_fill(0, 7, 0); 
        $institutionData = array_fill(0, 7, 0); 

        // Populate personal subscription data
        foreach ($years as $index => $year) {
            if (isset($personalYearlyRevenue[$year])) {
                $personalData[$index] = $personalYearlyRevenue[$year];
            }
        }

        // Populate institutional subscription data
        foreach ($years as $index => $year) {
            if (isset($institutionYearlyRevenue[$year])) {
                $institutionData[$index] = $institutionYearlyRevenue[$year];
            }
        }

        $yearlyRevenueData = [
            'labels' => $years, 
            'datasets' => [
                [
                    'label' => 'Personal Subscription',
                    'data' => $personalData,
                    'borderColor' => 'rgb(54, 162, 235)',
                    'tension' => 0.1
                ],
                [
                    'label' => 'Institutional Subscription',
                    'data' => $institutionData,
                    'borderColor' => 'rgb(255, 99, 132)',
                    'tension' => 0.1
                ]
            ]
        ];

        return response()->json([
            'yearlyRevenueData' => $yearlyRevenueData
        ]);
    }

    private function getWeeklyManuscript()
    {
        // Manuscripts query can be left as is or optimized similarly
        $manuscriptsByDay = ManuscriptProject::selectRaw('DATE(updated_at) as publish_date, COUNT(*) as count')
            ->whereBetween('updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->where('is_publish', true)
            ->groupBy('publish_date')
            ->orderBy('publish_date')
            ->get();


        // Prepare data for each day of the week
        $daysOfWeek = [];
        for ($i = 0; $i < 7; $i++) {
            $day = Carbon::now()->startOfWeek()->addDays($i)->format('l');
            $daysOfWeek[$day] = 0; // Initialize count for each day
        }

        // Fill in the counts for the days where manuscripts were published
        foreach ($manuscriptsByDay as $manuscript) {
            $dayName = Carbon::parse($manuscript->publish_date)->format('l');
            $daysOfWeek[$dayName] = $manuscript->count; 
        }

        \Log::info('week', $daysOfWeek);

        $manuscriptCountWeekly = [
            'labels' => array_keys($daysOfWeek),
            'datasets' => [[
                'label' => 'Number of Manuscripts Published',
                'data' => array_values($daysOfWeek),
                'backgroundColor' => 'rgba(54, 162, 235,0.8)',
                'tension' => 0.1,
                'barPercentage' => 0.5,
                'barThickness' => 30,
                'maxBarThickness' => 50,
                'minBarLength' => 2,
                'borderRadius' => 20
            ]]
        ];

        \Log::info($manuscriptCountWeekly);

        return $manuscriptCountWeekly;
    }

    public function getMonthlyManuscript()
    {
        // Manuscripts query for the current year, grouped by month
        $manuscriptsByMonth = ManuscriptProject::selectRaw('MONTHNAME(updated_at) as month, COUNT(*) as count')
            ->whereYear('updated_at', Carbon::now()->year) // For the current year
            ->where('is_publish', true)
            ->groupBy('month')
            ->orderByRaw('MONTH(updated_at)') // To order by the actual month number
            ->get();
    
        // Prepare data for each month of the year, initializing count to 0
        $monthsOfYear = [
            'January' => 0,
            'February' => 0,
            'March' => 0,
            'April' => 0,
            'May' => 0,
            'June' => 0,
            'July' => 0,
            'August' => 0,
            'September' => 0,
            'October' => 0,
            'November' => 0,
            'December' => 0
        ];
    
        // Fill in the counts for the months where manuscripts were published
        foreach ($manuscriptsByMonth as $manuscript) {
            $monthsOfYear[$manuscript->month] = $manuscript->count;
        }
    
        \Log::info($monthsOfYear);
    
        // Prepare the data for Chart.js or other front-end chart libraries
        $manuscriptCountMonthly = [
            'labels' => array_keys($monthsOfYear),
            'datasets' => [[
                'label' => 'Number of Manuscripts Published',
                'data' => array_values($monthsOfYear),
                'backgroundColor' => 'rgba(75, 192, 192, 0.8)',
                'tension' => 0.1,
                'barPercentage' => 0.5,
                'barThickness' => 30,
                'maxBarThickness' => 50,
                'minBarLength' => 2,
                'borderRadius' => 20
            ]]
        ];
    
        return response()->json([
            'manuscriptCountMonthly' => $manuscriptCountMonthly
        ]);
    }
    

    public function getYearlyManuscript()
    {
        $currentYear = Carbon::now()->year;
        $startYear = $currentYear - 6; 

        // Manuscripts query for the last 6 years
        $manuscriptsByYear = ManuscriptProject::selectRaw('YEAR(updated_at) as publish_year, COUNT(*) as count')
            ->whereBetween('updated_at', [$startYear . '-01-01', $currentYear . '-12-31'])
            ->where('is_publish', true)
            ->groupBy('publish_year')
            ->orderBy('publish_year')
            ->get();

        // Prepare data for each year in the range
        $yearsRange = [];
        for ($year = $startYear; $year <= $currentYear; $year++) {
            $yearsRange[$year] = 0; 
        }

        // Fill in the counts for the years where manuscripts were published
        foreach ($manuscriptsByYear as $manuscript) {
            $yearsRange[$manuscript->publish_year] = $manuscript->count;
        }

        \Log::info($yearsRange);

        $manuscriptCountYearly = [
            'labels' => array_keys($yearsRange),
            'datasets' => [[
                'label' => 'Number of Manuscripts Published',
                'data' => array_values($yearsRange),
                'backgroundColor' => 'rgba(153, 102, 255, 0.8)',
                'tension' => 0.1,
                'barPercentage' => 0.5,
                'barThickness' => 30,
                'maxBarThickness' => 50,
                'minBarLength' => 2,
                'borderRadius' => 20
            ]]
        ];

        return response()->json([
            'manuscriptCountYearly' => $manuscriptCountYearly
        ]);
    }



}

