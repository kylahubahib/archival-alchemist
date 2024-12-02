<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        api: __DIR__ . '/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Web middleware
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class, 
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
        
        // // API middleware
        // $middleware->api(append: [
        //     'throttle:api',
        //     \Illuminate\Routing\Middleware\SubstituteBindings::class,
        // ]);

        // Custom middleware aliases
        $middleware->alias([ 
            'user-type' => \App\Http\Middleware\CheckUserTypeMiddleware::class,
            'access' => \App\Http\Middleware\AccessControlMiddleware::class,
            'check-google' => \App\Http\Middleware\CheckGoogleConnection::class
        ]);

        // Global middleware for handling CORS (ensure this is applied if needed)
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom exception handling (if needed)
    })
    ->create();
