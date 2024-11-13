<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class Course extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'courses';

    protected $fillable = [
        'dept_id',
        'course_name',
        'course_acronym',
        'added_by'
    ];

    public function sections(): HasMany  // Renamed to sections
    {
        return $this->hasMany(Section::class, 'course_id'); // Ensure 'course_id' is correct here
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'dept_id');
    }



}
