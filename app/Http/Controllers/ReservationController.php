<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Schedule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Response;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $reservation = Reservation::whereNull('deleted_at')
            ->get();
        return response()->json($reservation);
    }

    public function list(Request $request)
    {
        $reservation = Reservation::whereNull('deleted_at')
            ->where('faculty_id', $request->faculty_id)
            ->get();
        return response()->json($reservation);
    }

    public function save(Request $request)
    {
        $reservation = Reservation::create($request->all());
        return Response::json($reservation, 200);
    }

    public function update(Request $request, Reservation $reservation)
    {
        if ($request->status == 'approved') {
            // dd($request->faculty_id);
            $schedule = Schedule::find($reservation->schedule_id);
            $schedule->book_by = $request->faculty_id;
            $schedule->update();
            Reservation::where('schedule_id', $reservation->schedule_id)->update(['status' => 'rejected']);
        }
        $reservation->update($request->all());
        return Response::json($reservation, 201);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->deleted_at = now();
        $reservation->update();
        return Response::json(array('success' => true));
    }
}
