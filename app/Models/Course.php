<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $primaryKey = 'course_id';

    protected $fillable = [
        'dept_id',
        'course_name',
        'added_by'
    ];


    public function student(): HasMany
    {
        return $this->hasMany(Student::class, 'stud_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'dept_id');
    }

    public function section(): HasMany
    {
        return $this->hasMany(Section::class, 'sec_id');
    }
}
