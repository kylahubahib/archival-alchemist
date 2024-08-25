<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules; 
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class UserFeedbacksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $feedbacks = Feedback::with('user')->paginate(100);  


        return Inertia::render('SuperAdmin/UserFeedbacks/UserFeedbacks', [
            'feedbacks' => $feedbacks
        ]);
    }

}
