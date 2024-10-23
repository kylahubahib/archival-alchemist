<?php

use App\Http\Controllers\StudentClassController;
use App\Http\Controllers\TeacherClassController;
use Illuminate\Support\Facades\Route;
use App\Models\Student;
use App\Http\Controllers\TagController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


use App\Http\Controllers\UserReportController;
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

use App\Http\Controllers\InstitutionSubscriptionController;
use App\Http\Controllers\PersonalSubscriptionController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ReportReasonController;



use App\Http\Middleware\CheckUserTypeMiddleware;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::get('/auth/user', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'user_type' => $request->user()->user_type,
        // Add any other fields you might need
    ]);
})->middleware('auth');

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

Route::get('/authors', function () {
    return Inertia::render('Users/Authors');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('authors');

Route::get('/tags', function () {
    return Inertia::render('Users/Tags');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('tags');

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

// Route::get('/subscription', function () {
//     return Inertia::render('Users/UserSubscription');
// })->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('subscription');

Route::get('/user-subscription', [PersonalSubscriptionController::class, 'index'])->name('user-subscription');


Route::post('/feedback', [UserFeedbacksController::class, 'store'])->name('user-feedbacks.store');
Route::post('/report', [UserReportController::class, 'store'])->name('user-reports.store');
Route::get('/report-types', [UserReportController::class, 'reportTypeList']);
Route::get('/check-feedback', [UserFeedbacksController::class, 'CheckIfFeedbackExist'])->name('check-feedback');
Route::get('/check-university-subscription', [UniversityController::class, 'checkUniversitySubscription'])->name('check-university-subscription');
Route::get('/landing-page', [LandingPageController::class, 'index'])->name('landing-page.index');





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

    Route::get('/user-reports', function () {
        return Inertia::render('SuperAdmin/UserReports/UserReports');})->name('user-reports');

    ///ADVANCED ROUTES
    ///Decided to create routes for the buttons in advanced page to simplify or easily create the crud functionality

    Route::get('/advanced/forum', function () {
        return Inertia::render('SuperAdmin/Advanced/Forum/Forum');})->name('advanced-forum');

    Route::resource('advanced/custom-messages', CustomMessagesController::class)->names('manage-custom-messages');

    Route::resource('advanced/universities', UniversityController::class)->names('manage-universities');

    Route::resource('advanced/tags', AdvancedTagsController::class)->names('manage-tags');

    Route::resource('advanced/report-reason', ReportReasonController::class)->names('manage-report-reason');

    Route::post('store-service', [CustomMessagesController::class, 'storeService'])->name('store-service');
    Route::post('store-team', [CustomMessagesController::class, 'storeTeam'])->name('store-team');
    Route::post('update-icon', [CustomMessagesController::class, 'updateIcon'])->name('update-icon');

    ///END ADVANCED ROUTES

    Route::resource('manage-terms-and-conditions', TermsAndConditionController::class);

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

    Route::resource('/departments', DepartmentsController::class)->names('manage-departments');

    Route::resource('/courses', CoursesController::class)->names('manage-courses');

    Route::resource('/sections', SectionsController::class)->names('manage-sections');

    Route::get('/faculties', function () {
        return Inertia::render('InstitutionAdmin/Faculties');})->name('institution-faculties');

    Route::get('/students', function () {
        return Inertia::render('InstitutionAdmin/Students');})->name('institution-students');

    Route::resource('/subscription-billing', InstitutionSubscriptionController::class)->names('institution-subscription-billing');

    Route::post('/upload-csv', [InstitutionSubscriptionController::class, 'uploadCSV'])->name('upload-csv');
    Route::get('/read-csv', [InstitutionSubscriptionController::class, 'readCSV'])->name('read-csv');
    Route::get('/get-plans', [SubscriptionPlanController::class, 'getPlans'])->name('get-plans');

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
    Route::post('/api/capstone/upload', [StudentClassController::class, 'storeManuscriptProject'])->name('api.capstone.upload');

    // Route for tracking a student's activity
    Route::post('/student/track-activity', [StudentClassController::class, 'trackActivity'])
        ->name('student.trackActivity.store');

    // Route for approving a student's project
    Route::post('/student/approve-project', [StudentClassController::class, 'approveProject'])
        ->name('student.approveProject.store');
    });
    Route::post('/api/check-title', [StudentClassController::class, 'checkTitle'])->name('capstone.checkTitle');

//Add a route for fetching tag suggestions:
    // In api.php or web.php
Route::get('/api/tags/suggestions', [TagController::class, 'suggestions']);

Route::get('tags/existing', [TagController::class, 'existingTags']);

Route::post('/api/tags/store', [TagController::class, 'storeTags']);
Route::post('/tags/get-tag-ids', [TagController::class, 'getTagIds']);
Route::get('/api/tags/get-tags', [TagController::class, 'index']);


Route::get('/api/tags', [TagController::class, 'index']);


//Add a route for fetching tag suggestions:
    // In api.php or web.php
    Route::get('/api/authors/suggestions', [TagController::class, 'Authorsuggestions']);

//route for checking the class code
Route::post('/check-class-code', [StudentClassController::class, 'checkClassCode']);
// routes for storing student in class table
Route::post('/store-student-class', [StudentClassController::class, 'storeStudentClass']);
// routes for checking the user premium subscription
Route::post('/check-user-premium-status', [CheckSubscriptionController::class, 'is_premium']);

Route::get('/check-student-in-class', [StudentClassController::class, 'checkStudentInClass']);



Route::get('/api/approved-manuscripts', [StudentClassController::class, 'getApprovedManuscripts']);
Route::get('/api/my-approved-manuscripts', [StudentClassController::class, 'myApprovedManuscripts']);
Route::get('/api/my-favorite-manuscripts', [StudentClassController::class, 'myfavoriteManuscripts']);

Route::post('/api/addfavorites', [StudentClassController::class, 'storefavorites'])
    ->middleware(['auth', 'verified', 'user-type:student, teacher'])
    ->name('storefavorites');
    Route::get('/manuscript/{id}/download', [StudentClassController::class, 'downloadPdf'])->name('manuscript.download');

   // Route::get('/manuscript/{id}/download', [StudentClassController::class, 'downloadPdf']);
// Correct
// Route::get('/user/{id}/favorites', [StudentClassController::class, 'getUserFavorites']);

// Add the correct middleware if needed
Route::get('/user/{id}/favorites', [StudentClassController::class, 'getUserFavorites'])
->middleware(['auth', 'verified', 'user-type:student, teacher'])
->name('getUserFavorites');


// Route for removing a favorite
Route::delete('/api/removefavorites', [StudentClassController::class, 'removeFavorite'])
    ->middleware(['auth', 'verified', 'user-type:student,teacher'])
    ->name('removeFavorite');



//check user in csv file
Route::post('/check-user-in-spreadsheet', [CheckSubscriptionController::class, 'checkUserInSpreadsheet']);


//Search and filter
Route::get('/search', [SearchController::class, 'search']);
Route::get('/searchlib', [SearchController::class, 'searchlib']);



Route::middleware('auth')->group(function () {
   Route::get('/teacher/class', [TeacherClassController::class, 'index'])->name('teacher.class');
});


// Route::middleware('auth')->group(function () {
//     Route::get('/display/groupclass', [TeacherClassController::class, 'DisplayGroupClass'])->name('teacher.class');
// });




//Teacher Activity API routes
Route::post('/store-newGroupClass', [TeacherClassController::class, 'newGroupClass']);
Route::get('/manuscripts/class', [TeacherClassController::class, 'getManuscriptsByClass']);
// Route for updating manuscript status
Route::put('/manuscripts/{id}/update-status', [TeacherClassController::class, 'updateManuscriptStatus']);
Route::get('/get-manuscripts', [TeacherClassController::class, 'getManuscriptsByClass']);
Route::get('/students/search', [TeacherClassController::class, 'searchStudents']);
Route::post('/classes/add-students', [TeacherClassController::class, 'addStudentsToClass']);


//Ratings
// Route::post('/ratings', [StudentClassController::class, 'storeRatings'])
// ->middleware(['auth', 'verified', 'user-type:student, teacher'])->name('storeRatings');

//Ratings
Route::post('/ratings', [StudentClassController::class, 'storeRatings']);
require __DIR__.'/auth.php';
