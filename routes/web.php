<?php

use App\Http\Middleware\CheckUserTypeMiddleware;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/library', function () {
    return Inertia::render('Users/Library');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('library');

Route::get('/forum', function () {
    return Inertia::render('Users/Forum');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('forum');

Route::get('/class', function () {
    return Inertia::render('Users/Class');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('class');


Route::get('/savedlist', function () {
    return Inertia::render('Users/SavedList');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('savedlist');

Route::get('/inbox', function () {
    return Inertia::render('Users/Inbox');
})->middleware(['auth', 'verified', 'user-type:student,teacher'])->name('inbox');





//SUPERADMIN
Route::get('/dashboard', function () {
    return Inertia::render('SuperAdmin/Dashboard');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('dashboard');

Route::get('/users', function () {
    return Inertia::render('SuperAdmin/Users');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('users');

Route::get('/archives', function () {
    return Inertia::render('SuperAdmin/Archives');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('archives');

Route::get('/subscription-billing', function () {
    return Inertia::render('SuperAdmin/SubscriptionBilling');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('subscription-billing');

Route::get('/user-feedbacks', function () {
    return Inertia::render('SuperAdmin/UserFeedbacks');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('user-feedbacks');

Route::get('/user-reports', function () {
    return Inertia::render('SuperAdmin/UserReports');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('user-reports');

Route::get('/terms-condition', function () {
    return Inertia::render('SuperAdmin/TermsCondition');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('terms-condition');

Route::get('/subscription-plans', function () {
    return Inertia::render('SuperAdmin/SubscriptionPlans');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('subscription-plans');

Route::get('/faq', function () {
    return Inertia::render('SuperAdmin/Faq');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('faq');

Route::get('/advanced', function () {
    return Inertia::render('SuperAdmin/Advanced');
})->middleware(['auth', 'verified', 'user-type:superadmin'])->name('advanced');




//institution admin
Route::get('/institution/archives', function () {
    return Inertia::render('InstitutionAdmin/Archives');
})->middleware(['auth', 'verified', 'user-type:admin'])->name('institution-archives');

Route::get('/institution/coadmins', function () {
    return Inertia::render('InstitutionAdmin/CoAdmins');
})->middleware(['auth', 'verified', 'user-type:admin'])->name('institution-coadmins');

Route::get('/institution/courses', function () {
    return Inertia::render('InstitutionAdmin/Courses');
})->middleware(['auth', 'verified', 'user-type:admin'])->name('institution-courses');

Route::get('/institution/departments', function () {
    return Inertia::render('InstitutionAdmin/Departments');
})->middleware(['auth', 'verified', 'user-type:admin'])->name('institution-departments');

Route::get('/institution/faculties', function () {
    return Inertia::render('InstitutionAdmin/Faculties');
})->middleware(['auth', 'verified', 'user-type:admin'])->name('institution-faculties');

Route::get('/institution/students', function () {
    return Inertia::render('InstitutionAdmin/Students');
})->middleware(['auth', 'verified', 'user-type:admin'])->name('institution-students');

Route::get('/institution/subscription-billing', function () {
    return Inertia::render('InstitutionAdmin/SubscriptionBilling');
})->middleware(['auth', 'verified', 'user-type:admin'])->name('institution-subscrition-billing');


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

//guest
Route::get('/tour', function () {
    return Inertia::render('Tour');
})->name('tour');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');

Route::get('/termsandcondition', function () {
    return Inertia::render('Terms&Condition');
})->name('termsandcondition');




Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
