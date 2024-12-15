<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Closure;

class VerifyCsrfToken extends Middleware
{

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        // 'login',  
        // 'register',
        // 'logout',
        // 'auth/*', 
    ];


    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
{
    // Log the session CSRF token
    \Log::info('Session Token:', ['session_token' => \Session::token()]);

    // Log the `_token` from the request payload
    \Log::info('Request _token:', ['request_token' => $request->input('_token')]);

    // Log the `X-CSRF-TOKEN` from the request headers
    \Log::info('Request X-CSRF-TOKEN:', ['header_token' => $request->header('X-CSRF-TOKEN')]);

    // Log the `XSRF-TOKEN` from the request cookies
    \Log::info('Request XSRF-TOKEN:', ['cookie_token' => $request->cookie('XSRF-TOKEN')]);

    // Log all request headers
    \Log::info('Request Headers:', $request->headers->all());

    // Perform token validation (if necessary)
    if ($request->input('_token') && \Session::token() !== $request->input('_token')) {
        \Log::warning('CSRF token mismatch detected.');
        return redirect()->guest('/')
            ->with('global', 'Expired token found. Redirecting to /');
    }

    return parent::handle($request, $next);
}

}

