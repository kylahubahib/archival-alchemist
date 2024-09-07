<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    use HasFactory;

    protected $fillable = [
        'uni_name'
    ];

    public function university_branch(): HasMany
    {
        return $this->hasMany(UniversityBranch::class, 'uni_id');
    }
}