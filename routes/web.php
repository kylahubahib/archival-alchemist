<?php

use App\Http\Controllers\TermsAndConditionController;
use App\Http\Controllers\UniversityController;
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
        return Inertia::render('SuperAdmin/Dashboard');})->name('dashboard');

    Route::get('/users', function () {
        return Inertia::render('SuperAdmin/Users');})->name('users');

    Route::get('/archives', function () {
        return Inertia::render('SuperAdmin/Archives');})->name('archives');

    Route::get('/subscription-billing', function () {
        return Inertia::render('SuperAdmin/SubscriptionBilling');})->name('subscription-billing');

    Route::get('/user-feedbacks', function () {
        return Inertia::render('SuperAdmin/UserFeedbacks');})->name('user-feedbacks');

    Route::get('/user-reports', function () {
        return Inertia::render('SuperAdmin/UserReports');})->name('user-reports');

    Route::get('/subscription-plans', function () {
        return Inertia::render('SuperAdmin/SubscriptionPlans');})->name('subscription-plans');

    Route::get('/faq', function () {
        return Inertia::render('SuperAdmin/Faq');})->name('faq');

    Route::get('/advanced', function () {
        return Inertia::render('SuperAdmin/Advanced');})->name('advanced');

    Route::resource('manage-terms-and-conditions', TermsAndConditionController::class);
});


//institution admin
Route::middleware(['auth', 'verified', 'user-type:admin'])->prefix('institution')->group(function () {
    Route::get('/archives', function () {
        return Inertia::render('InstitutionAdmin/Archives');})->name('institution-archives');

    Route::get('/coadmins', function () {
        return Inertia::render('InstitutionAdmin/CoAdmins');})->name('institution-coadmins');

    Route::get('/courses', function () {
        return Inertia::render('InstitutionAdmin/Courses');})->name('institution-courses');

    Route::get('/departments', function () {
        return Inertia::render('InstitutionAdmin/Departments');})->name('institution-departments');

    Route::get('/faculties', function () {
        return Inertia::render('InstitutionAdmin/Faculties');})->name('institution-faculties');

    Route::get('/students', function () {
        return Inertia::render('InstitutionAdmin/Students');})->name('institution-students');

    Route::get('/subscription-billing', function () {
        return Inertia::render('InstitutionAdmin/SubscriptionBilling');})->name('institution-subscription-billing');
});

//guest
Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/tour', function () {
    return Inertia::render('Tour');
})->name('tour');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');

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
