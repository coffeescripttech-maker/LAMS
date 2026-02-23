<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Setting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Response;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $attendance = Attendance::whereNull('deleted_at')
            ->get();
        return response()->json($attendance);
    }

    public function list(Request $request)
    {
        $attendance = Attendance::whereNull('deleted_at')
                    ->whereUserId($request->student_id)
            ->get();
        return response()->json($attendance);
    }

    public function today()
    {
        $attendance = Attendance::whereNull('deleted_at')
                ->whereDate('created_at', now()->toDateString())
                ->orderBy("created_at", "desc")
                ->get();
        return response()->json($attendance);
    }

    public function checkAvailable(Request $request)
    {
        $setting =  Setting::whereNull('deleted_at')
            ->first();
        $attendance = Attendance::whereNull('deleted_at')
            ->where("date", date('Y-m-d'))
            ->where("status", "IN")
            ->get();

        $attOut = Attendance::whereNull('deleted_at')
            ->where("date", date('Y-m-d'))
            ->where("status", "OUT")
            ->get();

        $taken = array();
        $out = array();
        foreach ($attOut as $key => $value) {
            $out[] =[
                'com_no' => $value->com_no,
                 "user_id" => $value->user_id? $value->user_id : $value->name
                ];
        }
        
        foreach ($attendance as $key => $value) {
            $taken[] =[
                'com_no' => $value->com_no,
                 "user_id" => $value->user_id? $value->user_id : $value->name
                ]; 
        }
        $taken = array_filter($taken, function($item) use ($out) {
            foreach ($out as $outItem) {
                if ($item['com_no'] == $outItem['com_no'] && $item['user_id'] == $outItem['user_id']) {
                    return false;
                }
            }
            return true;
        });

        // $taken = array_diff($taken, $out);
        $taken = array_map(function($item) {
            return $item['com_no'];
        }, $taken);

        // dd($taken);
        $available_slots = explode(',',$setting->available_slots);
        $obj = array_diff($available_slots, $taken);
        $available = array_values($obj);
        return response()->json($available);
        return response()->json($attendance);
    }

    public function save(Request $request)
    {
        // $lastTime = Attendance::whereNull('deleted_at')
        //     ->whereUserId($request->student_id)
        //     ->orderBy('id', 'desc')
        //     ->first();
        $attendance = Attendance::create($request->all());
        return Response::json($attendance, 200);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $input = $request->all();
        $attendance->update($input);
        return Response::json($attendance, 201);
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->deleted_at = now();
        $attendance->update();
        return Response::json(array('success' => true));
    }
}
