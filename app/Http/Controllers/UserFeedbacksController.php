<?php

namespace App\Http\Controllers;


use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules; 
use Illuminate\Http\Request;
use App\Models\Feedback;
use Inertia\Response;
use Inertia\Inertia;
use Carbon\Carbon;

class UserFeedbacksController extends Controller
{
    /**
     * 
     * Display a listing of the resource.
     */
    public function index()
    {
        $feedbacks = Feedback::with('user')->paginate(100); 
        $feedbackCount = Feedback::count(); 
        $averageRating= number_format(Feedback::average('feedback_rating'), 1);
        $ratingCounts = Feedback::selectRaw('feedback_rating, COUNT(*) as count')
            ->groupBy('feedback_rating')
            ->orderBy('feedback_rating')
            ->pluck('count', 'feedback_rating');
        $AllRatingCount = Feedback::sum('feedback_rating');


        return Inertia::render('SuperAdmin/UserFeedbacks/UserFeedbacks', [
            'feedbacks' => $feedbacks,
            'feedbackCount' => $feedbackCount,
            'averageRating' => $averageRating,
            'ratingCounts' => $ratingCounts,
            'AllRatingCount' => $AllRatingCount
        ]);
    }


    public function filterFeedbacks(Request $request)
    {
        $rating = $request->get('rating_value');
        $date = $request->get('date_value');

        $feedbacks = Feedback::with('user');

        if ($date != 'All') {
            switch ($date) {
                case 'Today':
                    $feedbacks->whereDate('created_at', Carbon::today());
                    break;
                case 'This Week':
                    $feedbacks->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                    break;
                case 'This Month':
                    $feedbacks->whereYear('created_at', Carbon::now()->year)
                            ->whereMonth('created_at', Carbon::now()->month);
                    break;
            }
        }

        if ($rating != 'All') {
            if($rating == 'Lowest'){
                $feedbacks->orderBy('feedback_rating', 'asc');

            } else if($rating == 'Highest'){
                $feedbacks->orderBy('feedback_rating', 'desc');
            } 
            else {
                $feedbacks->where('feedback_rating', $rating);
            }
        }


        $filteredFeedbacks = $feedbacks->get();
        //\Log::info($filteredFeedbacks->toArray());

        return response()->json($filteredFeedbacks);
    }

     /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        \Log::info('Feedback');

        $request->validate([
            'feedback_rating' => 'required|integer|min:0',
            'feedback_content' => 'nullable|string',
        ]);

        try {
            $existingFeedback = Feedback::where('user_id', Auth::id())->first();

            if ($existingFeedback) {

                $existingFeedback->update([
                    'feedback_rating' => $request->feedback_rating,
                    'feedback_content' => $request->feedback_content
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Thank you for your feedback again!'
                ]);
            }

            $feedback = Feedback::create([
                'user_id' => Auth::id(),
                'feedback_rating' => $request->feedback_rating,
                'feedback_content' => $request->feedback_content
            ]);

            \Log::info($feedback->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your feedback!'
            ]);

        } catch (\Exception $e) {

            \Log::error('Something is wrong: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit the feedback. Please try again.'
            ], 500);
        }
    }


    public function CheckIfFeedbackExist() {

        $feedbackExists = Feedback::where('user_id', Auth::id())->first();

            if ($feedbackExists) {
                return response()->json([
                    'feedbackExists' => $feedbackExists
                ]);
            }
    }

}
