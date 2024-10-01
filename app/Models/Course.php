<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';

    protected $fillable = [
        'dept_id',
        'course_name',
        'added_by'
    ];

    public function section(): HasMany
    {
        return $this->hasMany(Section::class, 'course_id');
    }

    public function department(): BelongsTo 
    {
        return $this->belongsTo(Department::class, 'dept_id');
    }

}
