<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CapstoneDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'cap_doc_id';

    public function class(): BelongsToMany
    {
        return $this->belongsToMany(Classes::class, 'class_id');
    }

    public function university_branch(): BelongsToMany
    {
        return $this->belongsToMany(UniversityBranch::class, 'uni_branch_id');
    }
}
