<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;
use Laravel\Sanctum\HasApiTokens;

class Event extends Model
{
    use HasFactory, HasApiTokens;
    protected $fillable = [
        'title',
        'description',
        'has_image',
        'likes',
        'deleted_at',
    ];
    protected $casts = [
        'likes' => 'array',
    ];
    protected $appends = [
        'list',
    ];

    function getListAttribute()
    {
        if ($this->comments) {
            return $this->comments;
        }
        return null;
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, "event_id");
    }
}
