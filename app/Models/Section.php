<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Section extends Model
{
    use HasFactory, HasApiTokens;
    protected $fillable = [
        'name',
        'yr_lvl',
        'is_ecoast',
        'deleted_at',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'section_id');
    }
}
