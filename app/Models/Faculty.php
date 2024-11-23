<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'uni_branch_id',
        'faculty_position',
        'course_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function university_branch()
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    

  
}
