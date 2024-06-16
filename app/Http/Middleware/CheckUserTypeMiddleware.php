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
        $user = $request->user();

        // Check if user is not authenticated
        if (in_array('guest', $allowedUserTypes) && !$user) {
            return $next($request);
        }

        // Check if there is an authenticated user
        if ($user) {
            if (in_array($user->user_type, $allowedUserTypes)) {
                return $next($request);
            }
        }

        return Redirect::back()->with('error', 'Unauthorized');
    }
}
