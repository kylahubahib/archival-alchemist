<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'stud_id';

    protected $fillable = [
        'user_id',
        'uni_branch_id',
        'course',
        'section_id'
    ];

    protected static function booted()
    {
        static::creating(function ($student) {
            $student->id = mt_rand(1000000000, 9999999999);  
            while (self::where('id', $student->id)->exists()) {
                $student->id = mt_rand(1000000000, 9999999999);
            }
        });
    }

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

    public function group_member(): HasOne
    {
        return $this->hasOne(GroupMember::class, 'student_id');
    }

    public function section(): HasOne
    {
        return $this->hasOne(Section::class, 'id', 'section_id');
    }
    // Define the relationship with TrackedActivity
    // public function trackedActivities(): HasMany
    // {
    //     return $this->hasMany(TrackedActivity::class, 'student_id');
    // }

    // public function university_branch(): BelongsTo
    // {
    //     return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    // }

    // public function departments(): BelongsTo
    // {
    //     return $this->belongsTo(Department::class, 'dept_id');
    // }

    // public function courses(): BelongsTo
    // {
    //     return $this->belongsTo(Course::class, 'c');
    // }

    // public function class_student(): HasMany
    // {
    //     return $this->hasMany(ClassStudent::class, 'class_id');
    // }
}
