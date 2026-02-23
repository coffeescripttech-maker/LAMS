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

        // Debug logging
        \Log::info('CheckRole middleware', [
            'user_id' => $user ? $user->id : 'null',
            'user_role' => $user ? $user->role : 'null',
            'required_roles' => $roles,
            'session_id' => session()->getId(),
            'auth_check' => Auth::check(),
            'url' => $request->url()
        ]);

        // If user is not authenticated, redirect to login
        if (!$user) {
            \Log::warning('CheckRole: User not authenticated, redirecting to login');
            return redirect('/login');
        }

        // Check if the user has the required role and is verified
        if (in_array($user->role, $roles) && $user->email_verified_at != null) {
            \Log::info('CheckRole: Access granted');
            return $next($request);
        }

        // If user doesn't have the right role, redirect to their dashboard
        \Log::warning('CheckRole: Wrong role, redirecting', [
            'user_role' => $user->role,
            'required_roles' => $roles
        ]);
        return redirect("/$user->role/dashboard");
    }
}
