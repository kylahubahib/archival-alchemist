<?php

use App\Http\Controllers\Pages\InsAdminCommonDataController;
use App\Http\Controllers\Pages\InstitutionAdmin\FacultyController;
use App\Http\Controllers\Pages\InstitutionAdmin\StudentController;
use App\Http\Controllers\Pages\SuperAdmin\UserController;
use App\Http\Controllers\UniversityController;
use App\Http\Middleware\CheckUserTypeMiddleware;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::inertia('/', 'Home');

Route::get('/admin-registration/{token}', [UserController::class, 'adminRegistrationForm'])->name('admin.registration-form');
Route::post('/submit-admin-registration', [UserController::class, 'submitAdminRegistration'])->name('admin.submit-admin-registration');

Route::middleware(['user-type:student,faculty,guest'])->group(function () {
    Route::inertia('/library', 'Users/Library')->name('library');
    Route::inertia('/forum', 'Users/Forum')->name('forum');
});

Route::middleware(['auth', 'verified', 'user-type:student,faculty'])->group(function () {
    Route::inertia('/class', 'Users/Class/Class')->name('class');
    Route::inertia('/savedlist', 'Users/SavedList')->name('savedlist');
    Route::inertia('/inbox', 'Users/Inbox')->name('inbox');
});

// Super Admin
Route::middleware(['auth', 'verified', 'user-type:super_admin'])->group(function () {
    // Dashboard page related routes with access middleware
    Route::middleware('access:dashboard_access')->group(function () {
        Route::inertia('/dashboard', 'SuperAdmin/Dashboard')->name('dashboard');
    });
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
    Route::middleware('access:user_reports_access')->group(function () {
        Route::inertia('/user-reports', 'SuperAdmin/UserReports')->name('user-reports');
    });
    Route::middleware('access:user_feedbacks_access')->group(function () {
        Route::inertia('/user-feedbacks', 'SuperAdmin/UserFeedbacks')->name('user-feedbacks');
    });
    Route::middleware('access:terms_and_conditions_access')->group(function () {
        Route::inertia('/terms-condition', 'SuperAdmin/TermsCondition')->name('terms-condition');
    });
    Route::middleware('access:subscription_plans_access')->group(function () {
        Route::inertia('/subscription-plans', 'SuperAdmin/SubscriptionPlans')->name('subscription-plans');
    });
    Route::middleware('access:faqs_access')->group(function () {
        Route::inertia('/faq', 'SuperAdmin/Faq')->name('faq');
    });
    Route::middleware('access:advanced_access')->group(function () {
        Route::inertia('/advanced', 'SuperAdmin/Advanced')->name('advanced');
    });
});


// Institution Admin
Route::middleware(['auth', 'verified', 'user-type:institution_admin'])->group(function () {
    // Common data for all pages
    Route::get('/institution/get-departments-with-courses', [InsAdminCommonDataController::class, 'getDepartmentsWithCourses'])
        ->name('institution.get-departments-with-courses');
    Route::get('/institution/get-plans-with-plan-status', [InsAdminCommonDataController::class, 'getPlansWithPlanStatus'])
        ->name('institution.get-plans-with-plan-status');

    // Pages
    Route::inertia('/institution/archives', 'InstitutionAdmin/Archives/Archives')->name('institution-archives');
    Route::inertia('/institution/coadmins', 'InstitutionAdmin/CoAdmin/CoAdmin')->name('institution-coadmins');
    Route::inertia('/institution/courses', 'InstitutionAdmin/Courses')->name('institution-courses');
    Route::inertia('/institution/departments', 'InstitutionAdmin/Departments')->name('institution-departments');

    // Students Page
    Route::redirect('/institution/students', '/institution/students/with-premium-access');
    Route::get('/institution/students/with-premium-access', [StudentController::class, 'index'])->name('institution-students');
    Route::get('/institution/students/{hasStudentPremiumAccess}', [StudentController::class, 'filter'])->name('institution-students.filter');
    Route::patch('/institution/students/{hasStudentPremiumAccess}', [StudentController::class, 'setPlanStatus'])->name('institution-students.set-plan-status');
    Route::post('/institution/students/add', [StudentController::class, 'addStudent'])->name('institution-students.add');

    // Faculties Page
    Route::redirect('/institution/faculties', '/institution/faculties/with-premium-access');
    Route::get('/institution/faculties/with-premium-access', [FacultyController::class, 'index'])->name('institution-faculties');
    Route::get('/institution/faculties/{hasFacultyPremiumAccess}', [FacultyController::class, 'filter'])->name('institution-faculties.filter');
    Route::patch('/institution/faculties/{hasFacultyPremiumAccess}', [FacultyController::class, 'setPlanStatus'])->name('institution-faculties.set-plan-status');
    Route::post('/institution/faculties/add', [FacultyController::class, 'addFaculty'])->name('institution-faculties.add');

    Route::inertia('/institution/subscription-billing', 'InstitutionAdmin/SubscriptionBilling')->name('institution-subscription-billing');
});


// Guests
Route::inertia('/home', 'Home')->name('home');
Route::inertia('/tour', 'Tour')->name('tour');
Route::inertia('/pricing', 'Pricing')->name('pricing');
Route::inertia('/terms-and-condition', 'Terms&Condition')->name('termsandcondition');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
