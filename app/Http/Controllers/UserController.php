<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Response, Hash, File;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = User::whereNull('deleted_at')
            ->whereRole($request->role)
            ->get();
        return response()->json($user);
    }


    public function list(Request $request)
    {
        $user = User::whereNull('deleted_at')
            ->whereRole($request->key)
            ->get();

        return response()->json($user);
    }

    public function save(Request $request)
    {
        try {
            // Validate required fields
            $validationRules = [
                'fname' => 'required|string|max:255',
                'lname' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'role' => 'required|in:admin,faculty,student',
                'mobile' => 'required|string|max:15',
                'address' => 'required|string|max:500',
                'dob' => 'required|date',
                'is_male' => 'required|boolean',
            ];

            // Add role-specific validation
            if ($request->role === 'student') {
                $validationRules['schoolId'] = 'required|string|max:255';
                $validationRules['verified'] = 'required|boolean';
            }

            if ($request->role === 'faculty') {
                $validationRules['occupation'] = 'required|string|max:255';
            }

            $request->validate($validationRules);

            $userData = $request->all();
            
            // Set default values
            $userData['email_verified_at'] = now();
            $userData['password'] = bcrypt($userData['password'] ?? 'password');
            
            // Ensure boolean fields are properly handled
            $userData['is_male'] = (bool)$userData['is_male'];
            
            if ($request->role === 'student') {
                $userData['verified'] = (bool)$userData['verified'];
            }
            
            $user = User::create($userData);

            return Response::json($user, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Response::json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('User creation failed: ' . $e->getMessage());
            return Response::json(['error' => 'Failed to create user', 'message' => $e->getMessage()], 500);
        }
    }

    public function student(Request $request, User $user)
    {
        $items = User::whereSectionId($user->id)
            ->whereStatus('re-enroll')
            ->update([
                'status' => 'enrolled',
                'section_id' => $request->section_id,
            ]);
        return Response::json($items, 201);
    }

    public function update(Request $request, User $user)
    {
        $input = $request->all();
        $user->update($input);

        if ($request->fingeprints) {
            for ($key = 1; $key <= count($request->fingeprints); $key++) {
                $val = $request->fingeprints[$key - 1];
                $path = public_path("storage/fingerprints/{$user->email}");
                if (!File::isDirectory($path)) {
                    File::makeDirectory($path, 0777, true, true);
                }
                $encoded_file = $val;
                $file = str_replace(' ', '+', $encoded_file);
                $decode_file   = base64_decode($file);
                $filename = "$key.png";
                file_put_contents("{$path}/{$filename}", $decode_file);
            }
        }
        return Response::json($user, 201);
    }

    public function destroy(User $user)
    {
        $user->deleted_at = now();
        $user->update();
        return Response::json(['success' => true]);
    }

    public function updatePassword(Request $request)
    {
        if ($request->new_password != $request->new_password_confirmation) {
            return Response::json(['err' => 'Password and confirm password not match'], 500);
        }
        $user = User::whereId($request->id)->first();
        #Match The Old Password
        if (!Hash::check($request->old_password, $user->password)) {
            return Response::json(['err' => 'Old password and new password not match'], 500);
        }

        #Update the new Password
        User::whereId($user->id)->update([
            'password' => Hash::make($request->new_password),
        ]);
        return Response::json(['success' => 'Password updated'], 201);
    }

    public function profile(Request $request)
    {
        $path = public_path("storage/credentials/{$request->email}");
        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0777, true, true);
        }
        $encoded_file = $request->file_base64;
        $pieces = explode(",", $encoded_file);
        $datatype = explode("/", $pieces[0]);
        $fileext = explode(";", $datatype[1]);

        $file = str_replace(' ', '+', $pieces[1]);
        $decode_file   = base64_decode($file);
        $filename = "{$request->name}.{$fileext[0]}";
        file_put_contents("{$path}/{$filename}", $decode_file);

        return Response::json(["success" => true], 200);
    }
}
