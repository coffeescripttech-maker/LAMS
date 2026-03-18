<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Comment;
use Laravel\Sanctum\HasApiTokens;

class Event extends Model
{
    use HasFactory, HasApiTokens, SoftDeletes;
    
    protected $fillable = [
        'title',
        'description',
        'has_image',
        'likes',
    ];
    
    protected $casts = [
        'likes' => 'array',
        'has_image' => 'boolean',
        'description' => 'string',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class, "event_id");
    }
    
    // Add a method to get comments when needed instead of using appends
    public function getCommentsListAttribute()
    {
        return $this->comments()->with('user')->get();
    }
}
