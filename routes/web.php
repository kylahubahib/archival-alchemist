<?php


use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Models\User;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\Pages\InstitutionAdmin\FacultyController;
use App\Http\Controllers\Pages\InstitutionAdmin\StudentController;
use App\Http\Controllers\Pages\SuperAdmin\UserController;
use Illuminate\Support\Facades\Redis;

use App\Http\Controllers\ClassController;
use App\Http\Controllers\StudentClassController;
use App\Http\Controllers\TeacherClassController;
use App\Http\Controllers\DocCommentsController;
use Illuminate\Support\Facades\Route;

use App\Models\Forum;
use App\Models\Student;
use App\Http\Controllers\TagController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ForumPostController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

use App\Http\Controllers\GoogleController;

use App\Http\Controllers\UserReportController;
use App\Http\Controllers\AdvancedTagsController;
use App\Http\Controllers\TermsAndConditionController;
use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Controllers\FAQController;
use App\Http\Controllers\UniversityController;
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
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdvancedForumController;


use App\Http\Controllers\PostController;

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

Route::get('/admin-registration/{token}', [UserController::class, 'adminRegistrationForm'])->name('admin.registration-form');
Route::post('/submit-admin-registration', [UserController::class, 'submitAdminRegistration'])->name('admin.submit-admin-registration');

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/payment/success', [PaymentSessionController::class, "paymentSuccess"])->name('payment.success');
Route::get('/payment/cancel', [PaymentSessionController::class, "paymentCancel"])->name('payment.cancel');
Route::post('/payment', [PaymentSessionController::class, 'PaymentSession'])->name('payment');
Route::post('/register-institution', [PaymentSessionController::class, 'registerInstitution'])->name('register.institution');
Route::post('/cancel-subscription',[InstitutionSubscriptionController::class, 'cancelSubscription']);

use Illuminate\Support\Facades\Crypt;

Route::get('/institution-subscriptions/get-started', function (Request $request) {
    $encryptedPlanId = $request->query('plan_id');
    try {
        $planId = Crypt::decrypt($encryptedPlanId);
        $plan = \App\Models\SubscriptionPlan::find($planId);

        if (!$plan) {
            abort(404, 'Plan not found.');
        }

        return Inertia::render('InstitutionSubForm', [
            'plan' => $plan,
        ]);
    } catch (\Exception $e) {
        abort(400, 'Invalid plan ID.');
    }
})->name('institution-subscriptions.get-started');

//Encrypt the id when you try to pass it using get
Route::post('/encrypt', function (Request $request) {
    $validated = $request->validate([
        'id' => 'required|integer',
    ]);

    return response()->json([
        'encryptedPlanId' => Crypt::encrypt($validated['id']),
    ]);
});




Route::get('/library', function () {
    return Inertia::render('Users/Library');
})->middleware(['user-type:student,teacher,guest,general_user'])->name('library');

Route::get('/forum', function () {
    return Inertia::render('Users/Forum');
})->middleware(['user-type:student,teacher,guest,general_user'])->name('forum');

// Route::get('/studentclass', function () {
//     return Inertia::render('Users/Class/Student/StudentClass');
// })->middleware(['auth', 'verified', 'user-type:student', 'check-google' ])->name('studentclass');

// Route::get('/teacherclass', function () {
//     return Inertia::render('Users/Class/Teacher/TeacherClass');
// })->middleware(['auth', 'verified', 'user-type:teacher', 'check-google'])->name('teacherclass');

Route::get('/studentclass', function () {
    return Inertia::render('Users/Class/Student/StudentClass');
});

Route::get('/teacherclass', function () {
    return Inertia::render('Users/Class/Teacher/TeacherClass');
});

Route::get('/authors', function () {
    return Inertia::render('Users/Authors');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('authors');

Route::get('/tags', function () {
    return Inertia::render('Users/Tags');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('tags');


Route::get('/savedlist', function () {
    return Inertia::render('Users/SavedList');
})->middleware(['auth', 'verified', 'user-type:student,teacher,general_user'])->name('savedlist');

Route::get('/inbox', function () {
    return Inertia::render('Users/Inbox');
})->middleware(['auth', 'verified', 'user-type:student,teacher,general_user'])->name('inbox');

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
Route::post('/affiliate-university', [ProfileController::class, 'affiliateUniversity'])->name('affiliate-university');

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.auth');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
Route::get('/connect/google', [GoogleController::class, 'promptGoogleConnection'])->name('prompt.google.connection');

//Route::get('/document/{fileId}/link', [GoogleDocsController::class, 'getGoogleDocLinkAPI']);


Route::post('/remove-affiliation', [ProfileController::class, 'removeAffiliation'])->name('remove-affiliation');

use App\Events\MessageSent;
use App\Mail\SubscriptionInquiryMail;
use App\Mail\NewAccountMail;
use Illuminate\Support\Facades\Mail;

Route::post('/send-to-email', function (Request $request) {

    $message = $request->input('message');
    $user = Auth::user();
    $data = [
        'name' => $user->name,
        'message' => $message
    ];

    //Mail::to($user->email)->send(new SubscriptionInquiryMail($data));
    Mail::to($user->email)->send(new NewAccountMail(['name' => $user->name]));

    return response()->json(['status' => 'Message sent!']);
});

Route::get('get-notifications', [NotificationController::class, 'getNotifications'])->name('get-notifications');
Route::post('mark-as-read', [NotificationController::class, 'markAsRead']);
Route::post('clear-notifications', [NotificationController::class, 'clearNotifications']);
Route::get('get-departments/{id}', [DepartmentsController::class, 'getAllDepartment'])->name('get-departments');


//SUPERADMIN
Route::middleware(['auth', 'verified', 'user-type:superadmin'])->group(function () {

    Route::middleware('access:users_access')->group(function () {
           Route::redirect('/users', 'users/student');
           Route::get('/users/student', [UserController::class, 'index'])->name('users');
           Route::post('/admin/send-registration', [UserController::class, 'sendAdminRegistration'])->name('users.send-admin-registration');
           Route::get('/users/{userType}', [UserController::class, 'filter'])->name('users.filter');
           Route::patch('/users/set-status', [UserController::class, 'setStatus'])->name('users.set-status');
           Route::patch('/users/set-entries-per-page', [UserController::class, 'setEntriesPerPage'])->name('users.set-entries-per-page');
           Route::patch('/users/set-searched-name', [UserController::class, 'setSearchedName'])->name('users.set-searched-name');
           Route::get('/users/{userId}/admin-access', [UserController::class, 'adminAccess'])->name('users.admin-access');
           Route::patch('/users/update-admin-access', [UserController::class, 'updateAdminAccess'])->name('users.update-admin-access');
           Route::get('/users/{userId}/logs', [UserController::class, 'logs'])->name('users.logs');
       });

        Route::middleware('access:archives_access')->group(function () {
           Route::inertia('/archives', 'SuperAdmin/Archives')->name('archives');
       });

        Route::middleware('access:subscriptions_and_billings_access')->group(function () {
           Route::inertia('/subscription-billing', 'SuperAdmin/SubscriptionBilling')->name('subscription-billing');
       });

       Route::middleware('access:subscription_plans_access')->group(function () {
           Route::resource('manage-subscription-plans', SubscriptionPlanController::class);
            Route::put('manage-subscription-plans/{id}/change-status', [SubscriptionPlanController::class, 'change_status'])
       ->name('manage-subscription-plans.change_status');


       });

    Route::middleware('access:user_feedbacks_access')->group(function () {
           Route::resource('user-feedbacks', UserFeedbacksController::class)->names('user-feedbacks')->except(['store']);
           Route::get('filter-feedbacks', [UserFeedbacksController::class, 'filterFeedbacks'])->name('filter-feedbacks');

       });

   Route::middleware('access:user_reports_access')->group(function () {
       Route::resource('user-reports', UserReportController::class)->names('user-reports')->except(['store']);
        Route::post('warn-user/{id}', [UserReportController::class, 'warnUser'])->name('user-reports.warning');
       Route::get('filter-user-reports', [UserReportController::class, 'filterReports'])->name('filter-user-reports');

   });

     Route::middleware('access:terms_and_conditions_access')->group(function () {
            Route::resource('manage-terms-and-conditions', TermsAndConditionController::class);
           Route::put('manage-terms-and-conditions/{id}/change-status', [TermsAndConditionController::class, 'change_status'])
               ->name('manage-terms-and-conditions.change_status');
       });

        Route::middleware('access:faqs_access')->group(function () {
         Route::resource('manage-faqs', FAQController::class);
           //Route::inertia('/faq', 'SuperAdmin/Faq')->name('faq');

       // You can use put or patch. Put is used to update a resource entirely
       // while patch is used to update a single fields

              Route::put('manage-faqs/{id}/change-status', [FAQController::class, 'change_status'])
       ->name('manage-faqs.change_status');


       });

        Route::middleware('access:advanced_access')->group(function () {
           //Route::inertia('/advanced', 'SuperAdmin/Advanced')->name('advanced');
           //ADVANCED ROUTES
        //Decided to create routes for the buttons in advanced page to simplify or easily create the crud functionality

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


       });


       Route::get('get-branches', [UniversityController::class, 'getBranches'])->name('get-branches');

        Route::middleware('access:dashboard_access')->group(function () {
            //Route::inertia('/dashboard', 'SuperAdmin/Dashboard')->name('dashboard');
            //DASHBOARD ROUTES
       Route::resource('dashboard', DashboardController::class)->names('dashboard');
       Route::get('get-weekly-manuscript', [DashboardController::class, 'getWeeklyManuscript']);
       Route::get('get-monthly-manuscript', [DashboardController::class, 'getMonthlyManuscript']);
       Route::get('get-yearly-manuscript', [DashboardController::class, 'getYearlyManuscript']);
       Route::get('get-monthly-revenue', [DashboardController::class, 'getMonthlyRevenue']);
       Route::get('get-yearly-revenue', [DashboardController::class, 'getYearlyRevenue']);
       //END OF DASHBOARD ROUTES


       });

   });




   //institution admin
Route::middleware(['auth', 'verified', 'user-type:institution_admin'])->prefix('institution')->group(function () {

    // Common data for all pages
    Route::get('/get-departments-with-courses', [InsAdminCommonDataController::class, 'getDepartmentsWithCourses'])
        ->name('institution.get-departments-with-courses');
    Route::get('/get-plans-with-plan-status', [InsAdminCommonDataController::class, 'getPlansWithPlanStatus'])
        ->name('institution.get-plans-with-plan-status');

    // Pages
    Route::inertia('/archives', 'InstitutionAdmin/Archives/Archives')->name('institution-archives');
    Route::inertia('/coadmins', 'InstitutionAdmin/CoAdmin/CoAdmin')->name('institution-coadmins');
    //Route::inertia('/courses', 'InstitutionAdmin/Courses')->name('institution-courses');
    //Route::inertia('/departments', 'InstitutionAdmin/Departments')->name('institution-departments');
    //Route::inertia('/institution/subscription-billing', 'InstitutionAdmin/SubscriptionBilling')->name('institution-subscription-billing');


    // Students Page
    Route::redirect('/students', '/institution/students/with-premium-access');
    Route::get('/students/with-premium-access', [StudentController::class, 'index'])->name('institution-students');
    Route::get('/students/{hasStudentPremiumAccess}', [StudentController::class, 'filter'])->name('institution-students.filter');
    Route::patch('/students/{hasStudentPremiumAccess}', [StudentController::class, 'setPlanStatus'])->name('institution-students.set-plan-status');
    Route::post('/students/add', [StudentController::class, 'addStudent'])->name('institution-students.add');

    // Faculties Page
    Route::redirect('/faculties', '/institution/faculties/with-premium-access');
    Route::get('/faculties/with-premium-access', [FacultyController::class, 'index'])->name('institution-faculties');
    Route::get('/faculties/{hasFacultyPremiumAccess}', [FacultyController::class, 'filter'])->name('institution-faculties.filter');
    Route::patch('/faculties/{hasFacultyPremiumAccess}', [FacultyController::class, 'setPlanStatus'])->name('institution-faculties.set-plan-status');
    Route::post('/faculties/add', [FacultyController::class, 'addFaculty'])->name('institution-faculties.add');



    Route::resource('/departments', DepartmentsController::class)->names('manage-departments');
    Route::post('/reassign-courses/{id}', [DepartmentsController::class, 'reassignCourses'])->name('reassign-courses');
    Route::post('/unassign-courses/{id}', [DepartmentsController::class, 'unassignCourses'])->name('unassign-courses');

    Route::get('/get-courses', [CoursesController::class, 'getCourses'])->name('get-courses');
    Route::resource('/courses', CoursesController::class)->names('manage-courses');
    Route::post('/reassign-faculty/{id}', [CoursesController::class, 'reassignFaculty'])->name('reassign-faculty');
    Route::post('/unassign-faculty/{id}', [CoursesController::class, 'unassignFaculty'])->name('unassign-faculty');
    Route::get('/get-unassigned-courses', [CoursesController::class, 'getUnassignedCourses'])->name('get-unassigned-courses');
    Route::get('/get-unassigned-faculty', [CoursesController::class, 'getUnassignedFaculty'])->name('get-unassigned-faculty');
    Route::post('/assign-courses', [CoursesController::class, 'assignCourses'])->name('assign-courses');

    Route::get('/get-sections', [SectionsController::class, 'getSections'])->name('get-sections');
    Route::resource('/sections', SectionsController::class)->names('manage-sections');

    Route::resource('/subscription-billing', InstitutionSubscriptionController::class)->names('institution-subscription-billing');

    Route::post('/upload-csv', [InstitutionSubscriptionController::class, 'uploadCSV'])->name('upload-csv');
    Route::get('/read-csv', [InstitutionSubscriptionController::class, 'readCSV'])->name('read-csv');

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

Route::inertia('/privacy-policy', 'PrivacyPolicy')->name('privacy-policy');

Route::get('/faq', [ForumPostController::class, 'faq'])->name('faq');






Route::get('profile-pic/{filename}', [ProfileController::class, 'showProfilePic'])->name('profile.pic');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/picture', [ProfileController::class, 'updatePicture'])->name('profile.updatePicture');

    Route::post('/assign-user-role', [ProfileController::class, 'assignUserRole']);
    Route::get('/get-plans', [SubscriptionPlanController::class, 'getPlans'])->name('get-plans');
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
Route::get('/api/title/suggestions', [TagController::class, 'Titlesuggestions']);

//route for checking the class code
Route::post('/check-class-code', [StudentClassController::class, 'checkClassCode']);
// routes for storing student in class table
//Route::post('/store-student-class', [StudentClassController::class, 'storeStudentClass']);
// routes for checking the user premium subscription
Route::post('/check-user-premium-status', [CheckSubscriptionController::class, 'is_premium']);

Route::get('/check-student-in-class', [StudentClassController::class, 'checkStudentInClass']);



Route::get('/api/published-manuscripts', [StudentClassController::class, 'getPublishedManuscripts']);
Route::get('/api/publishedRec-manuscripts', [StudentClassController::class, 'getPublishedRecManuscripts']);
//Route::get('/api/published-manuscripts/{choice}', [StudentClassController::class, 'getPublishedManuscripts']);
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

});






//TEACHER ROUTES
Route::middleware('auth')->group(function () {
   Route::get('/teacher/class', [TeacherClassController::class, 'index'])->name('teacher.class');
   //Teacher Activity API routes
    Route::post('/store-newGroupClass', [TeacherClassController::class, 'newGroupClass']);
    Route::get('/manuscripts/class', [TeacherClassController::class, 'getManuscriptsByClass']);
    // Route for updating manuscript status
    Route::put('/manuscripts/{id}/update-status', [TeacherClassController::class, 'updateManuscriptStatus']);
    Route::get('/get-manuscripts', [TeacherClassController::class, 'getManuscriptsByClass']);
    Route::get('/students/search', [TeacherClassController::class, 'searchStudents']);
    Route::post('/classes/add-students', [TeacherClassController::class, 'addStudentsToClass']);

});


// Route::middleware('auth')->group(function () {
//     Route::get('/display/groupclass', [TeacherClassController::class, 'DisplayGroupClass'])->name('teacher.class');
// });

//Ratings
// Route::post('/ratings', [StudentClassController::class, 'storeRatings'])
// ->middleware(['auth', 'user-type:student, teacher'])->name('storeRatings');

//Ratings
Route::post('/ratings', [StudentClassController::class, 'storeRatings']);
Route::get('/groupmembers/{studIds}', [TeacherClassController::class, 'ViewGroupMembers']);


//FORUM ROUTES
// Route for displaying a specific post
Route::middleware(['web'])->group(function () {
    // Route to get all forum posts
    Route::get('/forum-posts', [ForumPostController::class, 'index']);

    // Route to create a new forum post
    Route::post('/forum-posts', [ForumPostController::class, 'store'])->name('forum-posts.store');

    // Route to get details of a specific post
    Route::get('/posts/{id}', [ForumPostController::class, 'show'])->name('posts.show');

    // Route to delete a specific post
    Route::delete('/forum-posts/{id}', [ForumPostController::class, 'destroy'])->name('forum-posts.destroy');

    // Route to increment the view count of a specific post
    Route::post('/forum-posts/{id}/view', [ForumPostController::class, 'incrementViewCount'])->name('forum-posts.incrementViewCount');
});

//Forum Comments
//Route::post('/posts/{post}/comments', [CommentController::class, 'store']);



// route::get('view_file/{file}', [StudentClassController::class, 'view']);


Route::get('/view_file/{filename}', [StudentClassController::class, 'view'])->name('view_file');


//class controller
// routes/api.php

// Route::get('/fetch-history', [ClassController::class, 'fetchHistory'])->name('fetch-history');
Route::get('/fetch-history/{manuscript_id}', [ClassController::class, 'fetchHistory'])->name('fetch-history');

Route::get('/fetch-courses', [ClassController::class, 'fetchCourses']);
Route::post('/store-sections', [ClassController::class, 'storeSection']); // Route for storing data
Route::get('/fetch-classes', [ClassController::class, 'fetchClasses']);
Route::get('/fetch-studentClasses', [ClassController::class, 'fetchStudentClasses']);

Route::post('/store-groupmembers', [ClassController::class, 'addStudentsToClass']);
Route::get('/fetch-currentuser', [ClassController::class, 'getCurrentUser']);

Route::get('/fetch-groupmembers', [ClassController::class, 'getGroupMembers']);
// In web.php or api.php
Route::delete('/delete-groupmembers/{id}', [ClassController::class, 'deleteStudent']);

Route::post('/store-assignedTask/{section_id}', [ClassController::class, 'storeAssignedTask']);
Route::get('/fetch-AssignedTask/{section_id}', [ClassController::class, 'fetchAssignedTask']);
Route::get('/fetch-specificAssignedTask/{section_id}', [ClassController::class, 'specificAssignedTask']);

Route::post('/store-feedback/{manuscript_id}', [ClassController::class, 'storeFeedback']);

Route::get('comments/{documentId}', [DocCommentsController::class, 'getComments']);
Route::post('/comments', [DocCommentsController::class, 'storeComment']);

Route::get('/ispremium', [StudentClassController::class, 'isPremium'])->name('ispremium');

Route::get('/test-redis', function () {
    return Redis::ping();
});




//Commments
Route::get('/fetch-comments/{id}', [DocCommentsController::class, 'fetchComments'])->name('fetch-comments');
//Route::get('/fetch-replies', [DocCommentsController::class, 'fetchReplies'])->name('fetchrepllies');


require __DIR__.'/auth.php';
