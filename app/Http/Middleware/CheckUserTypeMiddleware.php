<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Redirect;

class CheckUserTypeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$allowedUserTypes)
    {
        // Check if the user is authenticated and their user type matches the allowed user type
        if (in_array($request->user()->user_type, $allowedUserTypes)) {
            // If the user type is allowed, proceed to the next middleware
            return $next($request);
        }
    
        return Redirect::back()->with('error', 'Unauthorized');
    }
    
}
