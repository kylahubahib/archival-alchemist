<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UniversityBranch extends Model
{
    use HasFactory;

    protected $fillable = [
        'uni_id',
        'uni_branch_name'
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class, 'uni_id');
    }
}