<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Event;
use App\Models\User;

class Comment extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'event_id',
        'description',
        'user_id',
        'deleted_at',
    ];
    
    protected $appends = [];

    public function getCommenterAttribute()
    {
        return $this->user ? $this->user->email : 'Unknown User';
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
