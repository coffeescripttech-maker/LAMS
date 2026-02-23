<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use File, Response;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $event = Event::whereNull('deleted_at')
            ->get();
        return response()->json($event);
    }

    public function list(Request $request)
    {
        $event = Event::whereNull('deleted_at')
            ->get();
        return response()->json($event);
    }

    public function save(Request $request)
    {
        $event = Event::create($request->all());
        if ($request->file_base64) {
            $path = public_path("storage/events");
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }
            $encoded_file = $request->file_base64;
            $pieces = explode(",", $encoded_file);
            $datatype = explode("/", $pieces[0]);
            $fileext = explode(";", $datatype[1]);

            $file = str_replace(' ', '+', $pieces[1]);
            $decode_file   = base64_decode($file);
            $filename = "{$event->id}.{$fileext[0]}";
            file_put_contents("{$path}/{$filename}", $decode_file);
        }
        return Response::json($event, 200);
    }

    public function update(Request $request, Event $event)
    {
        $input = $request->all();
        $event->update($input);
        if ($request->file_base64) {
            $path = public_path("storage/events");
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }
            $encoded_file = $request->file_base64;
            $pieces = explode(",", $encoded_file);
            $datatype = explode("/", $pieces[0]);
            $fileext = explode(";", $datatype[1]);

            $file = str_replace(' ', '+', $pieces[1]);
            $decode_file   = base64_decode($file);
            $filename = "{$event->id}.{$fileext[0]}";
            file_put_contents("{$path}/{$filename}", $decode_file);
        }
        return Response::json($event, 201);
    }

    public function destroy(Event $event)
    {
        $event->deleted_at = now();
        $event->update();
        return Response::json(array('success' => true));
    }
}
