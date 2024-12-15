<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_name',
        'section_id',
        'task_id',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(AssignedTask::class, 'task_id');
    }

    public function group_member(): HasMany
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }
}