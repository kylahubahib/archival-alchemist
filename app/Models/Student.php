<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'stud_id';

    protected $fillable = [
        'user_id',
        'stud_id',
        'uni_branch_id',
        'dept_id',
        'course_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    public function departments(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'dept_id');
    }

    public function courses(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'c');
    }

    public function class_student(): HasMany
    {
        return $this->hasMany(ClassStudent::class, 'class_id');
    }
}
