<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Attendance extends Model
{
   use HasFactory, HasApiTokens;
    protected $fillable = [
        'user_id',
        'name',
        'date',
        'time',
        'status',
        'remarks',
        'com_no',
        'deleted_at',
        'section'
    ];

    protected $appends = ['student_name', "section_name"];

    public function getStudentNameAttribute()
    {
        if ($this->name) {
            return $this->name;
        }
        return $this->user->full_name ?? null;
    }

    public function getSectionNameAttribute()
    {
        if ($this->section) {
            return $this->section;
        }
        return $this->user->section_name ?? null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
