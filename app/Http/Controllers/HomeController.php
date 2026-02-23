<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $user = Auth::user();
        
        // Debug logging
        \Log::info('HomeController accessed', [
            'user_id' => $user ? $user->id : 'null',
            'user_role' => $user ? $user->role : 'null',
            'session_id' => session()->getId(),
            'auth_check' => Auth::check()
        ]);
        
        return redirect()->intended("/$user->role/dashboard");
        return view('welcome');
    }
}
