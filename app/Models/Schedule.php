<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Schedule extends Model
{
    use HasFactory, HasApiTokens;
    protected $fillable = [
        "start_time",
        "end_time",
        "date",
        "book_by",
        "deleted_at",
    ];

    protected $appends = ['faculty_name'];

    public function getFacultyNameAttribute()
    {
        if ($this->book_by) {
            return $this->faculty->full_name;
        }
        return null;
    }

    public function faculty()
    {
        return $this->belongsTo(User::class, 'book_by');
    }
}
