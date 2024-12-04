<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'uni_branch_id',
        'faculty_position',
        'course_id',
        'dept_id'
    ];

    protected static function booted()
    {
        static::creating(function ($faculty) {
            $faculty->id = mt_rand(1000000000, 9999999999);
            while (self::where('id', $faculty->id)->exists()) {
                $faculty->id = mt_rand(1000000000, 9999999999);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function university_branch()
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    public function course(): HasOne
    {

        return $this->hasOne(Course::class, 'id', 'course_id');
    }
}
