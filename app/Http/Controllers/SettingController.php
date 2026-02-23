<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Response;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $setting = Setting::whereNull('deleted_at')
            ->get();
        return response()->json($setting);
    }

    public function list(Request $request)
    {
        $setting = Setting::whereNull('deleted_at')
            ->get();
        return response()->json($setting);
    }

    public function save(Request $request)
    {
        $setting = Setting::create($request->all());
        return Response::json($setting, 200);
    }

    public function update(Request $request, Setting $setting)
    {
        $input = $request->all();
        $setting->update($input);
        return Response::json($setting, 201);
    }

    public function destroy(Setting $setting)
    {
        $setting->deleted_at = now();
        $setting->update();
        return Response::json(array('success' => true));
    }
}
