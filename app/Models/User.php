<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Comment;
use App\Models\Section;
use App\Models\Attendance;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fname',
        'mname',
        'lname',
        'suffix',
        'address',
        'mobile',
        'dob',
        'role',
        'is_male',
        'schoolId',
        'finger_print',
        'email_verified_at',
        'verified',
        'occupation',
        'email',
        'section_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    protected $appends = [
        'full_name',
        'section_name',
    ];
    public function getFullNameAttribute()
    {
        $fullName = $this->fname . " " . ($this->mname ? $this->mname[0] . "." : "") . " " . $this->lname;
        return $fullName;
    }

    public function getSectionNameAttribute()
    {
        if ($this->section_id) {
            return $this->section()->first()->name ?? null;
        }
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, "user_id");
    }
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
