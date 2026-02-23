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

        // Check if the user has the required role
        if ($user && in_array($user->role, $roles) && $user->email_verified_at != null) {
            return $next($request);
        }

        // Redirect or respond with an error
        return redirect()->intended("/$user->role/dashboard");
    }
}
