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
<<<<<<< HEAD
        'course_id',  
=======
        'course_id',  // Corrected spelling here
        'subject_name',
>>>>>>> 809d8214ae5878541f4f68dd4ad2c54a10b13446
        'section_name',
        'added_by',
        'ins_id'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'ins_id');
    }
}
