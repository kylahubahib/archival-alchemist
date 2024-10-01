<?php

use App\Http\Controllers\StudentClassController; // Add this line
use App\Models\Student;
use App\Http\Controllers\TagController;

use App\Http\Controllers\AdvancedTagsController;
use App\Http\Controllers\TermsAndConditionController;
use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Controllers\FAQController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CheckSubscriptionController;
use App\Http\Controllers\UserFeedbacksController;
use App\Http\Controllers\CustomMessagesController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\CoursesController;
use App\Http\Controllers\SectionsController;
use App\Http\Controllers\PaymentSessionController;
use App\Http\Controllers\UserReportController;


use App\Http\Middleware\CheckUserTypeMiddleware;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
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

//Route::post('/create-checkout-session', [StripeController::class, 'createCheckoutSession']);
//Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
Route::get('/payment/success', [PaymentSessionController::class, "paymentSuccess"])->name('payment.success');
Route::get('/payment/cancel', [PaymentSessionController::class, "paymentCancel"])->name('payment.cancel');
Route::post('/payment', [PaymentSessionController::class, 'PaymentSession'])->name('payment');



Route::get('/library', function () {
    return Inertia::render('Users/Library');
})->middleware(['user-type:student,teacher,guest'])->name('library');

Route::get('/forum', function () {
    return Inertia::render('Users/Forum');
})->middleware(['user-type:student,teacher,guest'])->name('forum');

Route::get('/studentclass', function () {
    return Inertia::render('Users/Class/Student/StudentClass');
})->middleware(['auth', 'verified', 'user-type:student'])->name('studentclass');

Route::get('/teacherclass', function () {
    return Inertia::render('Users/Class/Teacher/TeacherClass');
})->middleware(['auth', 'verified', 'user-type:teacher'])->name('teacherclass');


Route::get('/savedlist', function () {
    return Inertia::render('Users/SavedList');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('savedlist');

Route::get('/inbox', function () {
    return Inertia::render('Users/Inbox');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('inbox');


Route::get('/authors', function () {
    return Inertia::render('Users/Authors');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('authors');

Route::get('/tags', function () {
    return Inertia::render('Users/Tags');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('tags');



Route::post('/feedback', [UserFeedbacksController::class, 'store'])->name('user-feedbacks.store');

Route::post('/report', [UserReportController::class, 'store'])->name('user-reports.store');

Route::get('/report-types', [UserReportController::class, 'reportTypeList']);

Route::get('/check-feedback', [UserFeedbacksController::class, 'CheckIfFeedbackExist'])->name('check-feedback');


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

    ///ADVANCED ROUTES
    ///Decided to create routes for the buttons in advanced page to simplify or easily create the crud functionality

    Route::get('/advanced', function () {
        return Inertia::render('SuperAdmin/Advanced/Advanced');})->name('advanced');

    Route::get('/advanced/forum', function () {
        return Inertia::render('SuperAdmin/Advanced/Forum/Forum');})->name('advanced-forum');

    Route::resource('advanced/custom-messages', CustomMessagesController::class)->names('manage-custom-messages');

    Route::resource('advanced/universities', UniversityController::class)->names('manage-universities');

    Route::resource('advanced/tags', AdvancedTagsController::class)->names('manage-tags');

    ///END ADVANCED ROUTES

    Route::resource('manage-terms-and-conditions', TermsAndConditionController::class)->names('manage-terms-and-conditions');

    Route::resource('manage-faqs', FAQController::class);

    Route::resource('manage-subscription-plans', SubscriptionPlanController::class);

    Route::resource('user-feedbacks', UserFeedbacksController::class)->names('user-feedbacks')->except(['store']);

    Route::resource('user-reports', UserReportController::class)->names('user-reports')->except(['store']);

    Route::get('filter-user-reports', [UserReportController::class, 'filterReports'])->name('filter-user-reports');
    Route::get('filter-feedbacks', [UserFeedbacksController::class, 'filterFeedbacks'])->name('filter-feedbacks');
    Route::get('get-branches', [UniversityController::class, 'getBranches'])->name('get-branches');



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



Route::get('profile-pic/{filename}', [ProfileController::class, 'showProfilePic'])->name('profile.pic');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/picture', [ProfileController::class, 'updatePicture'])->name('profile.updatePicture');
});

//Universities Controller Route
Route::get('api/universities-branches', [UniversityController::class, 'getUniversitiesWithBranches']);

//Terms and Condition Controller Route



//manuscript project
Route::middleware(['auth'])->group(function () {
    // Route for storing a new manuscript project
    Route::post('/capstone/upload', [StudentClassController::class, 'storeManuscriptProject'])->name('api.capstone.upload');

    // Route for tracking a student's activity
    Route::post('/student/track-activity', [StudentClassController::class, 'trackActivity'])
        ->name('student.trackActivity.store');

    // Route for approving a student's project
    Route::post('/student/approve-project', [StudentClassController::class, 'approveProject'])
        ->name('student.approveProject.store');
    });

//Add a route for fetching tag suggestions:
    // In api.php or web.php
Route::get('/api/tags/suggestions', [TagController::class, 'suggestions']);

Route::get('tags/existing', [TagController::class, 'existingTags']);

Route::post('/api/tags/store', [TagController::class, 'storeTags']);
Route::post('/tags/get-tag-ids', [TagController::class, 'getTagIds']);


//route for checking the class code
Route::post('/check-class-code', [StudentClassController::class, 'checkClassCode']);
// routes for storing student in class table
Route::post('/store-student-class', [StudentClassController::class, 'storeStudentClass']);
// routes for checking the user premium subscription
Route::post('/check-user-premium-status', [CheckSubscriptionController::class, 'is_premium']);



Route::get('/api/approved-manuscripts', [StudentClassController::class, 'getApprovedManuscripts']);


Route::get('/api/my-approved-manuscripts', [StudentClassController::class, 'myApprovedManuscripts']);

//check user in csv file
Route::post('/check-user-in-spreadsheet', [CheckSubscriptionController::class, 'checkUserInSpreadsheet']);

//Search and filter
Route::get('/search', [SearchController::class, 'search']);
Route::get('/searchlib', [SearchController::class, 'searchlib']);


require __DIR__.'/auth.php';
