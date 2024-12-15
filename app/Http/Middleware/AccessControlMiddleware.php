<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Pages\UserController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Import User modelP
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AccessControlMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $permission)
    {

        $user = $request->user();

        // Check if the user has the necessary access
        if ($user->access_control && isset($user->access_control->{$permission}) && !$user->access_control->{$permission}) {
            if ($user->user_type === "superadmin" || user->user_type === 'admin') {
                return Inertia::render('AccessDenied', [
                    'user' => $user,
                ]);
            }
        }

        return $next($request);
    }
}
