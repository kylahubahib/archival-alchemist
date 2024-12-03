<?php

namespace App\Providers;

use App\Models\AdminRegistrationToken;
use App\Observers\AdminRegistrationTokenObserver;
use Illuminate\Support\ServiceProvider;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //This will make the headers of csv files in certain format like id_number instead of Id NUmber
        HeadingRowFormatter::default('slug');

        // This will ensure that the observer's methods (like updated, deleted) are called
        // whenever changes are made to the AdminRegistrationToken model like token expiration
        AdminRegistrationToken::observe(AdminRegistrationTokenObserver::class);
    }
}
