<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

        // If user is not authenticated, redirect to login
        if (!$user) {
            return redirect('/login');
        }

        // Check if the user has the required role and is verified
        if (in_array($user->role, $roles) && $user->email_verified_at != null) {
            return $next($request);
        }

        // If user doesn't have the right role, redirect to their dashboard
        return redirect("/$user->role/dashboard");
    }
}
