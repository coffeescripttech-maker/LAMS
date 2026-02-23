<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $student = User::whereNull("deleted_at")->whereRole("student")->count();
        $faculty = User::whereNull("deleted_at")->whereRole("faculty")->count();
        $reservations_pending = Reservation::whereNull("deleted_at")->whereStatus("pending")->count();
        $reservations_approved = Reservation::whereNull("deleted_at")->whereStatus("approved")->count();
        $reservations_rejected = Reservation::whereNull("deleted_at")->whereStatus("rejected")->count();
        $all_reservations = Reservation::whereNull("deleted_at")->count();


        return  response()->json([
            "student" => $student,
            "faculty" => $faculty,
            "reservations_pending" => $reservations_pending,
            "reservations_approved" => $reservations_approved,
            "reservations_rejected" => $reservations_rejected,
            "all_reservations" => $all_reservations,
        ]);
    }

    public function transactions()
    {
        $transactions = Reservation::whereNull("deleted_at")->get();
        return response()->json($transactions);
    }
}
