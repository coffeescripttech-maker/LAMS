<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Response;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $comment = Comment::whereNull('deleted_at')
            ->whereEventId($request->key)
            ->get();
        return response()->json($comment);
    }

    public function list(Request $request)
    {
        $comment = Comment::whereNull('deleted_at')
            ->get();
        return response()->json($comment);
    }

    public function save(Request $request)
    {
        $comment = Comment::create($request->all());
        return Response::json($comment, 200);
    }

    public function update(Request $request, Comment $comment)
    {
        $input = $request->all();
        $comment->update($input);
        return Response::json($comment, 201);
    }

    public function destroy(Comment $comment)
    {
        $comment->deleted_at = now();
        $comment->update();
        return Response::json(array('success' => true));
    }
}
