<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\NotifySubscriptionExpiry;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Schedule::command(NotifySubscriptionExpiry::class)->daily();;
