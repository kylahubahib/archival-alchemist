<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignedTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_id',
        'task_title',
        'task',
        'task_instructions',
        'due_date'
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }
}
