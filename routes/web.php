<?php

use App\Http\Controllers\TagsController;
use App\Http\Controllers\TermsAndConditionController;
use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Controllers\FAQController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\UserFeedbacksController;
use App\Http\Controllers\CustomMessagesController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\CoursesController;
use App\Http\Controllers\SectionsController;

use App\Http\Middleware\CheckUserTypeMiddleware;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Home');
});


Route::get('/library', function () {
    return Inertia::render('Users/Library');
})->middleware(['user-type:student,teacher,guest'])-> name('library');
Route::get('/forum', function () {
    return Inertia::render('Users/Forum');
})->middleware(['user-type:student,teacher,guest'])->name('forum');


Route::get('/class', function () {
    return Inertia::render('Users/Class/Class');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('class');
Route::get('/savedlist', function () {
    return Inertia::render('Users/SavedList');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('savedlist');
Route::get('/inbox', function () {
    return Inertia::render('Users/Inbox');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('inbox');



//SUPERADMIN
Route::middleware(['auth', 'verified', 'user-type:superadmin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('SuperAdmin/Dashboard/Dashboard');})->name('dashboard');

    Route::get('/users', function () {
        return Inertia::render('SuperAdmin/Users');})->name('users');

    Route::get('/archives', function () {
        return Inertia::render('SuperAdmin/Archives');})->name('archives');

    Route::get('/subscription-billing', function () {
        return Inertia::render('SuperAdmin/SubscriptionBilling');})->name('subscription-billing');

    // Route::get('/user-feedbacks', function () {
    //     return Inertia::render('SuperAdmin/UserFeedbacks/UserFeedbacks');})->name('user-feedbacks');

    Route::get('/user-reports', function () {
        return Inertia::render('SuperAdmin/UserReports/UserReports');})->name('user-reports');

    // Route::get('/subscription-plans', function () {
    //      return Inertia::render('SuperAdmin/SubscriptionPlans/SubscriptionPlans');})->name('subscription-plans');

    // Route::get('/faq', function () {
    //     return Inertia::render('SuperAdmin/FrequentlyAskedQuestions/Faq');})->name('faq');

    ///ADVANCED ROUTES
    ///Decided to create routes for the buttons in advanced page to simplify or easily create the crud functionality 

    Route::get('/advanced', function () {
        return Inertia::render('SuperAdmin/Advanced/Advanced');})->name('advanced');

    Route::get('/advanced/forum', function () {
        return Inertia::render('SuperAdmin/Advanced/Forum/Forum');})->name('advanced-forum');

    // Route::get('/advanced/custom-messages', function () {
    //     return Inertia::render('SuperAdmin/Advanced/CustomMessages/CustomMessages');})->name('advanced-custom-messages');
    Route::resource('advanced/custom-messages', CustomMessagesController::class)->names('manage-custom-messages');

    // Route::get('/advanced/universities', function () {
    //     return Inertia::render('SuperAdmin/Advanced/Universities/Universities');})->name('universities');
    Route::resource('advanced/universities', UniversityController::class)->names('manage-universities');

    // Route::get('/advanced/tags', function () {
    //     return Inertia::render('SuperAdmin/Advanced/Tags/Tags');})->name('advanced-tags');
    Route::resource('advanced/tags', TagsController::class)->names('manage-tags');

    ///END ADVANCED ROUTES

    Route::resource('manage-terms-and-conditions', TermsAndConditionController::class);

    Route::resource('manage-faqs', FAQController::class);

    Route::resource('manage-subscription-plans', SubscriptionPlanController::class);

    Route::resource('user-feedbacks', UserFeedbacksController::class);


    // You can use put or patch. Put is used to update a resource entirely 
    // while patch is used to update a single fields

    Route::put('manage-terms-and-conditions/{id}/change-status', [TermsAndConditionController::class, 'change_status'])
    ->name('manage-terms-and-conditions.change_status');

    Route::put('manage-subscription-plans/{id}/change-status', [SubscriptionPlanController::class, 'change_status'])
    ->name('manage-subscription-plans.change_status');

    Route::put('manage-faqs/{id}/change-status', [FAQController::class, 'change_status'])
    ->name('manage-faqs.change_status');


});


//institution admin
Route::middleware(['auth', 'verified', 'user-type:admin'])->prefix('institution')->group(function () {
    Route::get('/archives', function () {
        return Inertia::render('InstitutionAdmin/Archives');})->name('institution-archives');

    Route::get('/coadmins', function () {
        return Inertia::render('InstitutionAdmin/CoAdmins');})->name('institution-coadmins');

    // Route::get('/departments', function () {
    //     return Inertia::render('InstitutionAdmin/Departments');})->name('institution-departments');
    Route::resource('/departments', DepartmentsController::class)->names('manage-departments');

    // Route::get('/courses', function () {
    //     return Inertia::render('InstitutionAdmin/Courses');})->name('institution-courses');
    
    Route::resource('/courses', CoursesController::class)->names('manage-courses');

    Route::resource('/sections', SectionsController::class)->names('manage-sections');

    Route::get('/faculties', function () {
        return Inertia::render('InstitutionAdmin/Faculties');})->name('institution-faculties');

    Route::get('/students', function () {
        return Inertia::render('InstitutionAdmin/Students');})->name('institution-students');

    Route::get('/subscription-billing', function () {
        return Inertia::render('InstitutionAdmin/SubscriptionBilling/SubscriptionBilling');})->name('institution-subscription-billing');
});

//guest
Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/tour', function () {
    return Inertia::render('Tour');
})->name('tour');

Route::get('/pricing', [SubscriptionPlanController::class, 'pricing'])->name('pricing');

Route::get('/terms-and-conditions', [TermsAndConditionController::class, 'terms_and_conditions'])->name('terms-and-conditions');

Route::get('/terms-and-condition', function () {
    return Inertia::render('Terms&Condition');
})->name('termsandcondition');





Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Universities Controller Route
Route::get('api/universities-branches', [UniversityController::class, 'getUniversitiesWithBranches']);

//Terms and Condition Controller Route


require __DIR__.'/auth.php';
