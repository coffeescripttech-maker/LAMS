<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Laravel\Sanctum\HasApiTokens;

class Reservation extends Model
{
    
   use HasFactory, HasApiTokens;
    protected $fillable = [
        'faculty_id',
        'schedule_id',
        'status',
        'deleted_at'
    ];

    protected $appends = ['faculty_name', 'schedule'];

    public function getFacultyNameAttribute()
    {
        if($this->faculty()->exists()){
            return $this->faculty()->first()->full_name;
        }
        return null;
    }

    public function getScheduleAttribute()
    {
        if($this->schedule()->exists()){
            $schedule = $this->schedule()->first();
            return date("M j, Y", strtotime($schedule->date)) . ' ' . $schedule->start_time . ' - ' . $schedule->end_time;
        }
        return null;
    }
    
    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

}
