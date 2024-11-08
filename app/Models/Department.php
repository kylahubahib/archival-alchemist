<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $primaryKey = 'dept_id';

    protected $fillable = [
        'uni_branch_id',
        'dept_name',
        'added_by'
    ];

    public function student(): HasMany
    {
        return $this->hasMany(Student::class, 'stud_id');
    }

    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class, 'fac_id');
    }
    public function course(): HasMany
    {
        return $this->hasMany(Course::class, 'dept_id');
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }
}
