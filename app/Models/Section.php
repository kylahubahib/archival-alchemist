<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Section extends Model
{
    use HasFactory;

    protected $table = 'sections';

    protected $fillable = [
        'course_id',  // Corrected spelling here
        'subject_name',
        'section_name',
        'section_classcode',
        'added_by',
        'ins_id'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'section_id');


    }



    public function user()
    {
        return $this->belongsTo(User::class, 'ins_id');
    }
}
