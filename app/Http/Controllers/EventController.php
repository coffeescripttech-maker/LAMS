<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use File, Response;

class EventController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Load events with their comments and users to avoid N+1 queries
            $events = Event::with(['comments.user'])->get();
            return response()->json($events);
        } catch (\Exception $e) {
            \Log::error('Events index error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch events', 'message' => $e->getMessage()], 500);
        }
    }

    public function list(Request $request)
    {
        try {
            // Load events with their comments and users to avoid N+1 queries
            $events = Event::with(['comments.user'])->get();
            return response()->json($events);
        } catch (\Exception $e) {
            \Log::error('Events list error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch events', 'message' => $e->getMessage()], 500);
        }
    }

    public function save(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'has_image' => 'boolean',
            ]);

            $event = Event::create($validatedData);
            
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
                $decode_file = base64_decode($file);
                $filename = "{$event->id}.{$fileext[0]}";
                file_put_contents("{$path}/{$filename}", $decode_file);
                
                $event->update(['has_image' => true]);
            }
            
            return response()->json($event, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Event creation error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create event', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Event $event)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'has_image' => 'boolean',
            ]);

            $event->update($validatedData);
            
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
                $decode_file = base64_decode($file);
                $filename = "{$event->id}.{$fileext[0]}";
                file_put_contents("{$path}/{$filename}", $decode_file);
                
                $event->update(['has_image' => true]);
            }
            
            return response()->json($event, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Event update error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update event', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Event $event)
    {
        try {
            $event->delete(); // This will soft delete using the SoftDeletes trait
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            \Log::error('Event deletion error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete event', 'message' => $e->getMessage()], 500);
        }
    }
}
