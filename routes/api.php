<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ReservationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// Route::group(['middleware' => 'auth:sanctum'], function () {
route::post('/changepassword/users/save', [UserController::class, 'updatePassword'])->name('update-password');
// dashboard
Route::prefix('/dashboard')->group(function () {
    route::get('/', [DashboardController::class, 'index']);
    route::get('/transactions', [DashboardController::class, 'transactions']);
});

//events
Route::prefix('/events')->group(function () {
    route::get('/', [EventController::class, 'index']);
    route::get('/list', [EventController::class, 'list']);
    route::put('/{event}/update', [EventController::class, 'update']);
    route::post('/save', [EventController::class, 'save']);
    route::delete('/{event}/destroy', [EventController::class, 'destroy']);
});

// comments
Route::prefix('/comments')->group(function () {
    route::get('/', [CommentController::class, 'index']);
    route::get('/list', [CommentController::class, 'list']);
    route::put('/{comment}/update', [CommentController::class, 'update']);
    route::post('/save', [CommentController::class, 'save']);
    route::delete('/{comment}/destroy', [CommentController::class, 'destroy']);
});

// Users
Route::prefix('/users')->group(function () {
    route::get('/', [UserController::class, 'index']);
    route::get('/list', [UserController::class, 'list']);
    route::put('/{user}/update', [UserController::class, 'update']);
    route::post('/save', [UserController::class, 'save']);
    route::post('/profiles/save', [UserController::class, 'profile']);
    route::delete('/{user}/destroy', [UserController::class, 'destroy']);
});

// settings
Route::prefix('/settings')->group(function () {
    route::get('/', [SettingController::class, 'index']);
    route::get('/list', [SettingController::class, 'list']);
    route::put('/{setting}/update', [SettingController::class, 'update']);
    route::post('/save', [SettingController::class, 'save']);
    route::delete('/{setting}/destroy', [SettingController::class, 'destroy']);
});

// attendances
Route::prefix('/attendances')->group(function () {
    route::get('/', [AttendanceController::class, 'index']);
    route::get('/today', [AttendanceController::class, 'today']);
    route::get('/checkAvailable', [AttendanceController::class, 'checkAvailable']);
    route::get('/list', [AttendanceController::class, 'list']);
    route::put('/{attendance}/update', [AttendanceController::class, 'update']);
    route::post('/save', [AttendanceController::class, 'save']);
    route::delete('/{attendance}/destroy', [AttendanceController::class, 'destroy']);
});

// sections
Route::prefix('/sections')->group(function () {
    route::get('/', [SectionController::class, 'index']);
    route::get('/list', [SectionController::class, 'list']);
    route::put('/{section}/update', [SectionController::class, 'update']);
    route::post('/save', [SectionController::class, 'save']);
    route::delete('/{section}/destroy', [SectionController::class, 'destroy']);
});

// schedules
Route::prefix('/schedules')->group(function () {
    route::get('/', [ScheduleController::class, 'index']);
    route::get('/list', [ScheduleController::class, 'list']);
    route::put('/{schedule}/update', [ScheduleController::class, 'update']);
    route::post('/save', [ScheduleController::class, 'save']);
    route::delete('/{schedule}/destroy', [ScheduleController::class, 'destroy']);
});

// reservations
Route::prefix('/reservations')->group(function () {
    route::get('/', [ReservationController::class, 'index']);
    route::get('/list', [ReservationController::class, 'list']);
    route::put('/{reservation}/update', [ReservationController::class, 'update']);
    route::post('/save', [ReservationController::class, 'save']);
    route::delete('/{reservation}/destroy', [ReservationController::class, 'destroy']);
});



// });
