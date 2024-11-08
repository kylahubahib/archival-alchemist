<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Faculty extends Model
{
    use HasFactory;

    protected $primaryKey = 'fac_id';

    protected $fillable = [
        'user_id',
        'uni_branch_id',
        'fac_position'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    public function departments(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'dept_id');
    }

    public function courses(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'c');
    }

    public function class(): HasMany
    {
        return $this->hasMany(Classes::class, 'class_id');
    }
}
