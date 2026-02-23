<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Response;
use Carbon\Carbon;

class ScheduleController extends Controller
{
   public function index(Request $request)
    {
        $schedule = Schedule::whereNull('deleted_at')
            ->get();
        return response()->json($schedule);
    }

    public function list(Request $request)
    {
        $schedule = Schedule::whereNull('deleted_at')
                    ->where("book_by", (bool)$request->booked ? "=" : "!=", null)
                    ->get();
        return response()->json($schedule);
    }

    public function save(Request $request)
    {
        $startDate = Carbon::create($request->start_date);
        $endDate = Carbon::create($request->end_date);
        $currentDate = $startDate;
        $model = [];
        $datas = [];
        $schedule;
        while ($currentDate->lte($endDate)) {
                    $schedule = Schedule::create([
                        'date' => $currentDate->toDateTimeString(),
                        'start_time' =>  $request->start_time,
                        'end_time' => $request->end_time,
                        'book_by' => $request->book_by??null,
                    ]);
                    array_push($datas, $schedule);
           
            $currentDate->addDay();
        }
        return Response::json($datas, 200);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $input = $request->all();
        $schedule->update($input);
        return Response::json($schedule, 201);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->deleted_at = now();
        $schedule->update();
        return Response::json(array('success' => true));
    }
}
