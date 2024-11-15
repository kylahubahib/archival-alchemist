<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignedTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_title',
        'task_instructions',
        'task_startdate',
        'task_duedate',
        'section_id'
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }
}
