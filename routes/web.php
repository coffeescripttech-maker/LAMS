<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Debug route to test session
Route::get('/test-session', function () {
    $sessionId = session()->getId();
    $testValue = session('test_value', 'not set');
    
    session(['test_value' => 'Session is working! ' . now()]);
    
    return response()->json([
        'session_id' => $sessionId,
        'previous_value' => $testValue,
        'new_value' => session('test_value'),
        'session_driver' => config('session.driver'),
        'all_session_data' => session()->all(),
    ]);
});

// Test flash data
Route::get('/test-flash', function () {
    session()->flash('test_message', 'This is a flash message!');
    return redirect('/test-flash-show');
});

Route::get('/test-flash-show', function () {
    return response()->json([
        'session_id' => session()->getId(),
        'flash_message' => session('test_message', 'Flash message not found'),
        'all_session' => session()->all(),
    ]);
});

// Auth::routes(['verify' => true]);
Auth::routes();


Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/attendance', function () {
    return view("attendance/index");
})->name('attendance');

Route::group(['middleware' => ['auth']], function () {
    Route::get('/user/profile', function () {
        return view('components.profile.index');
    })->name('user.profile');
    // Admin
    Route::group(['middleware' => ['checkRole:admin']], function () {
        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', function () {
                return view('platforms.admin.dashboard.index');
            })->name('admin.dashboard');

            Route::get('/events', function () {
                return view('platforms.admin.events.index');
            })->name('admin.events');


            Route::get('/settings', function () {
                return view('platforms.admin.settings.index');
            })->name('admin.settings');


            Route::get('/attendances', function () {
                return view('platforms.admin.attendances.index');
            })->name('admin.attendances');

            Route::get('/sections', function () {
                return view('platforms.admin.sections.index');
            })->name('admin.sections');

            Route::get('/schedules', function () {
                return view('platforms.admin.schedules.index');
            })->name('admin.schedules');

            Route::get('/reservations', function () {
                return view('platforms.admin.reservations.index');
            })->name('admin.reservations');

            Route::get('/users/{role}', function ($role) {
                return view('platforms.admin.users.index')->with('role', $role);
            })->name('admin.users');
        });
    });

    // Faculty
    Route::group(['middleware' => ['checkRole:faculty']], function () {
        Route::prefix('faculty')->group(function () {

            Route::get('/dashboard', function () {
                return view('platforms.faculty.dashboard.index');
            })->name('faculty.dashboard');

            Route::get('/schedules', function () {
                return view('platforms.faculty.schedules.index');
            })->name('faculty.schedules');

            Route::get('/attendances', function () {
                return view('platforms.faculty.attendances.index');
            })->name('faculty.attendances');

            Route::get('/reservations', function () {
                return view('platforms.faculty.reservations.index');
            })->name('faculty.reservations');

            Route::get('/users/student', function () {
                return view('platforms.faculty.users.index')->with('role', 'student');
            })->name('faculty.student');
        });
    });


    // Students
    Route::group(['middleware' => ['checkRole:student']], function () {
        Route::prefix('student')->group(function () {

            Route::get('/dashboard', function () {
                return view('platforms.student.dashboard.index');
            })->name('student.dashboard');

            Route::get('/availables', function () {
                return view('platforms.student.availables.index');
            })->name('student.availables');

            Route::get('/attendances', function () {
                return view('platforms.student.attendances.index');
            })->name('student.attendances');
        });
    });
});
