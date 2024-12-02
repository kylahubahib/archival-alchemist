<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pages\UsersController;
use App\Http\Controllers\Api\FetchDataController;
use App\Http\Middleware\CheckUserTypeMiddleware;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Auth;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/fetch-universities-with-branches', [FetchDataController::class, 'fetchUniversitiesWithBranches'])->name('fetch.universities-with-branches');
Route::get('/fetch-universities', [FetchDataController::class, 'fetchUniversities'])->name('fetch.universities');
Route::get('/fetch-departments', [FetchDataController::class, 'fetchDistinctDepartments'])->name('fetch.departments');
Route::get('/fetch-university-related-branches', [FetchDataController::class, 'fetchRelatedBranchesForUniversity'])->name('fetch.university-related-branches');
Route::get('/fetch-department-related-courses', [FetchDataController::class, 'fetchRelatedCoursesForDepartment'])->name('fetch.department-related-courses');
Route::get('/fetch-university-related-data', [FetchDataController::class, 'fetchRelatedDataForUniversity'])->name('fetch.university-related-data');
Route::get('/fetch-current-plans', [FetchDataController::class, 'fetchDistinctCurrentPlans'])->name('fetch.current-plans');
Route::get('/fetch-status', [FetchDataController::class, 'fetchDistinctUserStatus'])->name('fetch.status');
Route::get('/fetch-institution-admin-roles', [FetchDataController::class, 'fetchInstitutionAdminRoles'])->name('fetch.institution-admin-roles');
Route::get('/fetch-super-admin-roles', [FetchDataController::class, 'fetchSuperAdminRoles'])->name('fetch.super-admin-roles');




// USER VIEW APIS
Route::post('login', [AuthenticatedSessionController::class, 'store']);

Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

