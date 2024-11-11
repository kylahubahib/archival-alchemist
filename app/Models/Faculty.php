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
        'course_id', // Add course_id here if you want to allow it to be mass-assigned.
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function university_branch()
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    
}
