<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupMember extends Model
{
    use HasFactory;

    protected $fillable = ['stud_id', 'group_id', 'task_id', 'section_id',];

    // Relationship with users through the pivot table group_members
    public function members()
    {
        return $this->belongsToMany(User::class, 'group_members', 'id', 'stud_id')
            ->withTimestamps();
    }

    // Relationship with sections through the pivot table group_members
    public function sections()
    {
        return $this->belongsToMany(Section::class, 'group_members', 'id', 'section_id')
            ->withTimestamps();
    }

    // Relationship with sections through the pivot table group_members
    public function tasks()
    {
        return $this->belongsToMany(Section::class, 'group_members', 'id', 'task_id')
            ->withTimestamps();
    }

    // Relationship with group through the pivot table group_members
    public function group()
    {
        return $this->belongsToMany(Group::class, 'group_members', 'id', 'group_id')
            ->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'stud_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'stud_id', 'id');
    }
}
