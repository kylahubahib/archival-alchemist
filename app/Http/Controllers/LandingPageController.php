<?php

namespace App\Http\Controllers;

use App\Models\CustomContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class LandingPageController extends Controller
{
    public function index()
    {
        $servicesSection = CustomContent::where('content_type', 'our services')->get();
        $teamSection = CustomContent::where('content_type', 'our team')->get();
        $heroSection = CustomContent::where('content_type', 'hero page')->first();


        return response()->json([
            'heroSection' => $heroSection,
            'servicesSection' => $servicesSection,
            'teamSection' => $teamSection
        ]);
    }
}
