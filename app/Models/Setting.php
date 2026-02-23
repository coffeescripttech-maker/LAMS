<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Setting extends Model
{
    use HasFactory, HasApiTokens;
    protected $fillable = [
        'lab_name',
        'available_slots',
        'open_hour',
        'close_hour',
        'maintainance_slots',
        'deleted_at',
    ];
}
