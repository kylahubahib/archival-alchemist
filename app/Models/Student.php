<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'uni_branch_id',
        'course'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    // Define the relationship with CapstoneProject
    public function capstoneProjects(): HasMany
    {
        return $this->hasMany(ManuscriptProject::class, 'student_id');
    }

    // Define the relationship with TrackedActivity
    // public function trackedActivities(): HasMany
    // {
    //     return $this->hasMany(TrackedActivity::class, 'student_id');
    // }
}
