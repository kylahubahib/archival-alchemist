<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UniversityBranch extends Model
{
    use HasFactory;

    protected $primaryKey = 'uni_branch_id';

    protected $fillable = [
        'uni_id',
        'uni_branch_name'
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class, 'uni_id');
    }

    public function student(): HasMany
    {
        return $this->hasMany(Student::class, 'stud_id');
    }

    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class, 'fac_id');
    }

    public function institution_subscription(): HasOne
    {
        return $this->hasOne(InstitutionSubscription::class, 'insub_id');
    }

    public function department(): HasMany
    {
        return $this->hasMany(Department::class, 'dept_id');
    }

    public function capstone_document(): HasMany
    {
        return $this->hasMany(CapstoneDocument::class, 'cap_doc_id');
    }
}
