<?php


use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Http\Controllers\Pages\InstitutionAdmin\CoAdminController;
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
use App\Http\Controllers\SemesterController;

use App\Http\Controllers\ForumCommentController;


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

// Sending mail routes for unauthenticated user
Route::get('/admin-registration/{token}', [UserController::class, 'adminRegistrationForm'])->name('admin.registration-form');
Route::post('/submit-admin-registration', [UserController::class, 'submitAdminRegistration'])->name('admin.submit-admin-registration');

// Handles password reset request with rate limiting (5 requests per minute) to avoid spamming.
Route::post('/send-password-reset', [UserController::class, 'sendPasswordReset'])
    ->name('users.send-password-reset')
    ->middleware('throttle:5,1');
Route::get('/password-reset/{token}', [UserController::class, 'passwordResetForm'])->name('users.password-reset-form');
Route::post('/submit-password-reset', [UserController::class, 'submitPasswordReset'])->name('users.submit-password-reset');

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


// Route::get('/teacherclass', function () {
//     return Inertia::render('Users/Class/Teacher/TeacherClass');
// });

// Route::get('/studentclass', function () {
//     return Inertia::render('Users/Class/Student/StudentClass');
// })->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('studentclass');

Route::get('/forum', function () {
    return Inertia::render('Users/Forum');
})->middleware(['user-type:student,teacher,guest,general_user'])->name('forum');

Route::get('/studentclass', function () {
    return Inertia::render('Users/Class/Student/StudentClass');
})->middleware(['auth', 'verified', 'user-type:student', 'check-google' ])->name('studentclass');

Route::get('/teacherclass', function () {
    return Inertia::render('Users/Class/Teacher/TeacherClass');
})->middleware(['auth', 'verified', 'user-type:teacher', 'check-google'])->name('teacherclass');


// Route::get('/savedlist', function () {
//     return Inertia::render('Users/SavedList');
// })->middleware(['auth', 'verified', 'user-type:student,teacher,general_user'])->name('savedlist');


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
use App\Http\Controllers\Pages\InstitutionAdmin\ArchiveController;
use App\Http\Controllers\Pages\InstitutionAdmin\InsAdminArchiveController;
use App\Http\Controllers\Pages\SuperAdmin\SubscriptionBillingController;
use App\Http\Controllers\Pages\SuperAdmin\SuperAdminArchiveController;
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
    Mail::to('kyla.hubahib18@gmail.com')->send(new NewAccountMail(['name' => $user->name]));

    return response()->json(['status' => 'Message sent!']);
});

Route::get('get-notifications', [NotificationController::class, 'getNotifications'])->name('get-notifications');
Route::post('mark-as-read', [NotificationController::class, 'markAsRead']);
Route::post('clear-notifications', [NotificationController::class, 'clearNotifications']);
Route::get('get-departments/{id}', [DepartmentsController::class, 'getAllDepartment'])->name('get-departments');

//SUPERADMIN
Route::middleware(['auth', 'verified', 'user-type:superadmin'])->group(function () {

    Route::middleware('access:super_users_access')->group(function () {
        Route::redirect('/users', 'users/student');
        Route::get('/users/student', [UserController::class, 'index'])->name('users');
        Route::post('/admin/send-registration', [UserController::class, 'sendAdminRegistration'])->name('users.send-admin-registration');
        Route::get('/users/{userType}', [UserController::class, 'filter'])->name('users.filter');
        Route::patch('/users/update-status', [UserController::class, 'updateStatus'])->name('users.update-status');
        Route::patch('/users/set-entries-per-page', [UserController::class, 'setEntriesPerPage'])->name('users.set-entries-per-page');
        Route::patch('/users/set-searched-name', [UserController::class, 'setSearchedName'])->name('users.set-searched-name');
        Route::get('/users/{userId}/admin-access', [UserController::class, 'adminAccess'])->name('users.admin-access');
        Route::patch('/users/update-admin-access', [UserController::class, 'updateAdminAccess'])->name('users.update-admin-access');
        Route::get('/users/logs', [UserController::class, 'logs'])->name('users.logs');
    });

    Route::middleware('access:super_archives_access')->group(function () {
        Route::get('/archives', [SuperAdminArchiveController::class, 'index'])->name('archives');
        // Use '?' to make the parameters optional, so they can be omitted in the URL.
        Route::get('/archives/{university?}/{branch?}/{department?}/{course?}/{section?}', [SuperAdminArchiveController::class, 'filter'])
            ->name('archives.filter');
        Route::get('download/manuscript/{id}/{title?}', [SuperAdminArchiveController::class, 'downloadManuscript'])
            ->name('archives.download-manuscript');
        Route::get('open/manuscript/{id}/{title?}', [SuperAdminArchiveController::class, 'openManuscript'])
            ->name('archives.open-manuscript');
    });

    Route::middleware('access:super_subscription_billing_access')->group(function () {
        Route::redirect('/subscription-billing', '/subscription-billing/personal');
        Route::get('/subscription-billing', [SubscriptionBillingController::class, 'index'])->name('subscription-billing');
        Route::get('/subscription-billing/{subscriptionType}', [SubscriptionBillingController::class, 'filter'])->name('subscription-billing.filter');
    });

  
    Route::middleware('access:super_subscription_plans_access')->group(function () {
        Route::resource('manage-subscription-plans', SubscriptionPlanController::class);
        Route::put('manage-subscription-plans/{id}/change-status', [SubscriptionPlanController::class, 'change_status'])
            ->name('manage-subscription-plans.change_status');
    });

    Route::middleware('access:super_user_feedbacks_access')->group(function () {
           Route::resource('user-feedbacks', UserFeedbacksController::class)->names('user-feedbacks')->except(['store']);
           Route::get('filter-feedbacks', [UserFeedbacksController::class, 'filterFeedbacks'])->name('filter-feedbacks');

       });

   Route::middleware('access:super_user_reports_access')->group(function () {
       Route::resource('user-reports', UserReportController::class)->names('user-reports')->except(['store']);
        Route::post('warn-user/{id}', [UserReportController::class, 'warnUser'])->name('user-reports.warning');
       Route::get('filter-user-reports', [UserReportController::class, 'filterReports'])->name('filter-user-reports');

   });

     Route::middleware('access:super_terms_and_conditions_access')->group(function () {
            Route::resource('manage-terms-and-conditions', TermsAndConditionController::class);
           Route::put('manage-terms-and-conditions/{id}/change-status', [TermsAndConditionController::class, 'change_status'])
               ->name('manage-terms-and-conditions.change_status');
       });

        Route::middleware('access:super_faqs_access')->group(function () {
         Route::resource('manage-faqs', FAQController::class);
           //Route::inertia('/faq', 'SuperAdmin/Faq')->name('faq');

       // You can use put or patch. Put is used to update a resource entirely
       // while patch is used to update a single fields

              Route::put('manage-faqs/{id}/change-status', [FAQController::class, 'change_status'])
       ->name('manage-faqs.change_status');


       });

        Route::middleware('access:super_advanced_access')->group(function () {    

            
            Route::get('advanced/forum/filter-post', [AdvancedForumController::class, 'filterPost'])->name('filter-post');
            Route::resource('advanced/forum', AdvancedForumController::class)->names('manage-forum-posts');

            Route::resource('advanced/custom-messages', CustomMessagesController::class)->names('manage-custom-messages');

            Route::resource('advanced/universities', UniversityController::class)->names('manage-universities');

            Route::resource('advanced/tags', AdvancedTagsController::class)->names('manage-tags');

            Route::resource('advanced/report-reason', ReportReasonController::class)->names('manage-report-reason');

            Route::post('store-service', [CustomMessagesController::class, 'storeService'])->name('store-service');
            Route::post('store-team', [CustomMessagesController::class, 'storeTeam'])->name('store-team');
            Route::post('update-icon', [CustomMessagesController::class, 'updateIcon'])->name('update-icon');

       });


       Route::get('get-branches', [UniversityController::class, 'getBranches'])->name('get-branches');

        Route::middleware('access:super_dashboard_access')->group(function () {
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
Route::middleware(['auth', 'verified', 'user-type:admin'])->prefix('institution')->group(function () {

    // Common data for all pages
    Route::get('/get-departments-with-courses', [InsAdminCommonDataController::class, 'getDepartmentsWithCourses'])
        ->name('institution.get-departments-with-courses');
    Route::get('/get-plans-with-plan-status', [InsAdminCommonDataController::class, 'getPlansWithPlanStatus'])
        ->name('institution.get-plans-with-plan-status');

    // Pages

    // Route::inertia('/coadmins', 'InstitutionAdmin/CoAdmin/CoAdmin')->name('institution-coadmins');

 // Students Page
 Route::middleware('access:ins_students_access')->group(function () {
    Route::redirect('/students', '/institution/students/with-premium-access');
    Route::get('/students/with-premium-access', [StudentController::class, 'index'])->name('institution-students');
    Route::get('/students/{hasStudentPremiumAccess}', [StudentController::class, 'filter'])->name('institution-students.filter');
    Route::post('/students/add', [StudentController::class, 'addStudent'])->name('institution-students.add');
    Route::post('/students/update-premium-access', [StudentController::class, 'updatePremiumAccess'])->name('institution-students.update-premium-access');
});

    // Faculties Page
    Route::middleware('access:ins_faculties_access')->group(function () {
        Route::redirect('/faculties', '/institution/faculties/with-premium-access');
        Route::get('/faculties/with-premium-access', [FacultyController::class, 'index'])->name('institution-faculties');
        Route::get('/faculties/{hasFacultyPremiumAccess}', [FacultyController::class, 'filter'])->name('institution-faculties.filter');
        Route::post('/faculties/add', [FacultyController::class, 'addFaculty'])->name('institution-faculties.add');
        Route::post('/faculties/update-premium-access', [StudentController::class, 'updatePremiumAccess'])->name('institution-faculties.update-premium-access');
    });

    // CoAdmins Page
    Route::middleware('access:ins_coadmins_access')->group(function () {
        Route::post('/co-admin/send-registration', [UserController::class, 'sendAdminRegistration'])->name('institution-coadmins.send-registration');
        Route::post('/co-admin/send-registration', [UserController::class, 'sendAdminRegistration'])->name('institution-coadmins.send-registration');
        Route::patch('/coadmins/update-status', [UserController::class, 'updateStatus'])->name('institution-coadmins.update-status');
        Route::patch('/coadmins/update-admin-access', [UserController::class, 'updateAdminAccess'])->name('institution-coadmins.update-admin-access');
        Route::get('/coadmins', [CoAdminController::class, 'index'])->name('institution-coadmins');
        Route::get('/coadmins/{userId}/admin-access',   [UserController::class, 'adminAccess'])->name('institution-coadmins.admin-access');
    });

       // Archives Page
       Route::middleware('access:ins_coadmins_access')->group(function () {
        Route::patch('/archives', [InsAdminArchiveController::class, 'setManuscriptVisibility'])->name('institution-archives.set-manuscript-visibility');
        Route::get('/archives', [InsAdminArchiveController::class, 'index'])->name('institution-archives');
        // Use '?' to make the parameters optional, so they can be omitted in the URL.
        Route::get('archives/{department?}/{course?}/{section?}', [InsAdminArchiveController::class, 'filter'])->name('institution-archives.filter');
        Route::get('download/manuscript/{id}/{title?}', [InsAdminArchiveController::class, 'downloadManuscript'])->name('institution-archives.download-manuscript');
        Route::get('open/manuscript/{id}/{title?}', [InsAdminArchiveController::class, 'openManuscript'])->name('institution-archives.open-manuscript');
    });

    Route::middleware('access:ins_departments_access')->group(function () {
        Route::post('/reassign-courses/{id}', [DepartmentsController::class, 'reassignCourses'])->name('reassign-courses');
        Route::post('/unassign-courses/{id}', [DepartmentsController::class, 'unassignCourses'])->name('unassign-courses');

        Route::resource('/departments', DepartmentsController::class)->names('manage-departments');

        Route::post('/reassign-faculty/{id}', [CoursesController::class, 'reassignFaculty'])->name('reassign-faculty');
        Route::post('/unassign-faculty/{id}', [CoursesController::class, 'unassignFaculty'])->name('unassign-faculty');

        Route::get('/get-courses', [CoursesController::class, 'getCourses'])->name('get-courses');
        Route::resource('/courses', CoursesController::class)->names('manage-courses');

        Route::post('/reassign-faculty/{id}', [CoursesController::class, 'reassignFaculty'])->name('reassign-faculty');
        Route::post('/unassign-faculty/{id}', [CoursesController::class, 'unassignFaculty'])->name('unassign-faculty');
        Route::get('/get-unassigned-courses', [CoursesController::class, 'getUnassignedCourses'])->name('get-unassigned-courses');
        Route::get('/get-unassigned-faculty', [CoursesController::class, 'getUnassignedFaculty'])->name('get-unassigned-faculty');

        Route::post('/assign-courses', [CoursesController::class, 'assignCourses'])->name('assign-courses');
    });

    // Sections and Group Page
    Route::middleware('access:ins_sections_access')->group(function () {
        Route::resource('/sections', SectionsController::class)->names('manage-sections');
        Route::get('/get-sections', [SectionsController::class, 'getSections'])->name('get-sections');
        Route::resource('/semester', SemesterController::class)->names('manage-semester');
    });

    // Subscription and Billing Page
    Route::middleware('access:ins_subscription_billing_access')->group(function () {
        Route::resource('/subscription-billing', InstitutionSubscriptionController::class)->names('institution-subscription-billing');
        Route::post('/upload-csv', [InstitutionSubscriptionController::class, 'uploadCSV'])->name('upload-csv');
        Route::get('/read-csv', [InstitutionSubscriptionController::class, 'readCSV'])->name('read-csv');
        Route::post('/update-university', [InstitutionSubscriptionController::class, 'updateUniBranch'])->name('update-university');
    });
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

// Route::inertia('/privacy-policy', 'PrivacyPolicy')->name('privacy-policy');

Route::get('/faq', [FAQController::class, 'faq'])->name('faq');

Route::get('/privacy-policy', [TermsAndConditionController::class, 'privacyPolicy'])->name('privacy-policy');


Route::get('profile-pic/{filename}', [ProfileController::class, 'showProfilePic'])->name('profile.pic');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/picture', [ProfileController::class, 'updatePicture'])->name('profile.updatePicture');

    Route::post('/assign-user-role', [ProfileController::class, 'assignUserRole']);
    Route::get('/get-plans', [SubscriptionPlanController::class, 'getPlans'])->name('get-plans');
    Route::get('/get-semesters', [SemesterController::class, 'getSemester'])->name('get-semester');
    Route::get('/profile/{id}',[ProfileController::class, 'viewProfile'])->name('profile.view');
});

//Universities Controller Route
Route::get('api/universities-branches', [UniversityController::class, 'getUniversitiesWithBranches']);

//Terms and Condition Controller Route



//manuscript project
// Route::middleware(['auth'])->group(function () {
    // Route for storing a new manuscript project
    Route::post('/api/capstone/upload', [StudentClassController::class, 'storeManuscriptProject'])->name('api.capstone.upload');
    Route::put('/update-project/{id}', [StudentClassController::class, 'updateProject']);
     Route::get('/fetch-userType', [TeacherClassController::class, 'fetchUserType']);
        // Route for tracking a student's activity
        Route::post('/student/track-activity', [StudentClassController::class, 'trackActivity'])
            ->name('student.trackActivity.store');

        // Route for approving a student's project
        Route::post('/student/approve-project', [StudentClassController::class, 'approveProject'])
            ->name('student.approveProject.store');

        Route::post('/api/check-title', [StudentClassController::class, 'checkTitle'])->name('capstone.checkTitle');
    // });

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
Route::post('/store-student-class', [StudentClassController::class, 'storeStudentClass']);
// routes for checking the user premium subscription
Route::post('/check-user-premium-status', [CheckSubscriptionController::class, 'is_premium']);
Route::get('/check-student-in-class', [StudentClassController::class, 'checkStudentInClass']);
Route::get('/api/publishedRec-manuscripts', [StudentClassController::class, 'getPublishedRecManuscripts']);
Route::get('/api/publishedMyUniBooks-manuscripts', [StudentClassController::class, 'getMyUniBooks']);
Route::get('/api/my-approved-manuscripts', [StudentClassController::class, 'myApprovedManuscripts']);
Route::get('/api/teachers-repository', [StudentClassController::class, 'teachersRepository']);
Route::get('/api/my-favorite-manuscripts', [StudentClassController::class, 'myfavoriteManuscripts']);
Route::post('/api/addfavorites', [StudentClassController::class, 'storefavorites'])
    ->middleware(['auth', 'verified', 'user-type:student, teacher'])
    ->name('storefavorites');
    Route::get('/manuscript/{id}/download', [StudentClassController::class, 'downloadPdf'])->name('manuscript.download');


    // Route::middleware(['auth', 'verified', 'user-type:student,teacher'])->group(function () {
        // Route for getting user favorites
        Route::get('/user/{id}/favorites', [StudentClassController::class, 'getUserFavorites'])
            ->name('getUserFavorites');


    // Route for removing a favorite
    Route::delete('/api/removefavorites', [StudentClassController::class, 'removeFavorite'])
        ->middleware(['auth', 'verified', 'user-type:student,teacher'])
        ->name('removeFavorite');

        // Route to handle tracking of book views
    Route::post('/view-book/{bookId}', [TeacherClassController::class, 'viewBook'])->name('book.view');


    //check user in csv file
    Route::post('/check-user-in-spreadsheet', [CheckSubscriptionController::class, 'checkUserInSpreadsheet']);


    //Search and filter
    Route::get('/search', [SearchController::class, 'search']);
    Route::get('/searchlib', [SearchController::class, 'searchlib']);

    // });


        
    Route::get('/api/published-manuscripts', [StudentClassController::class, 'getPublishedManuscripts']);

    Route::get('/api/publishedRec-manuscripts', [StudentClassController::class, 'getPublishedRecManuscripts']);



//TEACHER ROUTES
Route::middleware('auth')->group(function () {
 //   Route::get('/student/class', [StudentClassController::class, 'index'])->name('student.class');

    Route::get('/get-groupID', [ClassController::class, 'getgroupID'])->name('group.id');
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
Route::get('/groupmembers/{manuscriptId}', [TeacherClassController::class, 'ViewGroupMembers']);


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

    //Route for Forum Comments
    // For fetching comments of a specific post
        Route::get('/forum-comments/{postId}', [ForumCommentController::class, 'index']);

        // For submitting a new comment or reply
        Route::post('/forum-comments', [ForumCommentController::class, 'store']);

        // For updating a comment
        Route::put('/forum-comments/{id}', [ForumCommentController::class, 'update']);

        // For deleting a comment
        Route::delete('/forum-comments/{id}', [ForumCommentController::class, 'destroy']);


        
Route::post('/store-newGroupmembers', [ClassController::class, 'addNewStudentsToClass']);
Route::get('/students/search-in-class', [TagController::class, 'searchStudents']);
Route::put('/update-project/{id}', [StudentClassController::class, 'updateProject']);

Route::get('/fetch-mygroupmembers/{id}', [ClassController::class, 'getMyGroupMembers']);

});





// route::get('view_file/{file}', [StudentClassController::class, 'view']);


Route::get('/view_file/{filename}', [StudentClassController::class, 'view'])->name('view_file');


//class controller
// routes/api.php
Route::get('/fetch-courses', [ClassController::class, 'fetchCourses']);
Route::post('/store-sections', [ClassController::class, 'storeSection']); // Route for storing data
Route::get('/fetch-classes', [ClassController::class, 'fetchClasses']);
Route::get('/fetch-studentClasses', [ClassController::class, 'fetchStudentClasses']);

Route::post('/store-groupmembers', [ClassController::class, 'addStudentsToClass']);
Route::get('/fetch-currentuser', [ClassController::class, 'getCurrentUser']);

Route::get('/fetch-groupmembers/{id}', [ClassController::class, 'getGroupMembers']);

Route::post('/store-newGroupmembers', [ClassController::class, 'addNewStudentsToClass']);
Route::get('/students/search-in-class', [TagController::class, 'searchStudents']);
Route::put('/update-project/{id}', [StudentClassController::class, 'updateProject']);

Route::get('/fetch-mygroupmembers/{id}', [ClassController::class, 'getMyGroupMembers']);

// In web.php or api.php
Route::delete('/delete-groupmembers/{id}', [ClassController::class, 'deleteStudent']);

Route::delete('/delete-mygroupmembers/{id}', [ClassController::class, 'removeMembers']);
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

Route::post('/send-for-revision', [StudentClassController::class, 'sendForRevision'])->name('send-for-revision');
Route::get('/manuscripts/group/{groupId}', [ClassController::class, 'getManuscriptsByGroup']);

Route::get('/api/semesters', [ClassController::class, 'getRecords']);

//Commments
Route::get('/fetch-comments/{id}', [DocCommentsController::class, 'fetchComments'])->name('fetch-comments');
//Route::get('/fetch-replies', [DocCommentsController::class, 'fetchReplies'])->name('fetchrepllies');

Route::post('/manuscripts/{id}/increment-view', [StudentClassController::class, 'incrementViewCount']);


Route::get('/api/check-group', [StudentClassController::class, 'checkGroup']);
Route::get('/fetch-userType', [TeacherClassController::class, 'n']);
Route::get('/fetch-affiliation', [TeacherClassController::class, 'fetchAffiliation']);



Route::get('/pdf-viewer/{filename}', function ($filename) {
    $path = storage_path('app/private/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
})->name('pdf.viewer');

 Route::get('/export-csv', [ClassController::class, 'exportCSV']);

 Route::get('/profile/post', [ProfileController::class, 'getForumPosts' ]);



require __DIR__.'/auth.php';
