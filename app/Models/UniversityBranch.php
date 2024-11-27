<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

class UniversityBranch extends Model
{
    use HasFactory;

    //protected $primaryKey = 'uni_branch_id';

    protected $table = 'university_branches';

    public $incrementing = false;

    protected $keyType = 'bigInteger';

    protected $fillable = [
        'uni_id',
        'uni_branch_name'
    ];

    protected static function booted()
    {
        static::creating(function ($uniBranch) {
            $uniBranch->id = mt_rand(1000000000, 9999999999);  
            while (self::where('id', $uniBranch->id)->exists()) {
                $uniBranch->id = mt_rand(1000000000, 9999999999);
            }
        });
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('Y-m-d');
    }

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('Y-m-d');
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class, 'uni_id');
    }

    public function student(): HasMany
    {
        return $this->hasMany(Student::class, 'uni_branch_id');
    }

    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class, 'uni_branch_id');
    }

    public function institution_subscription(): HasOne
    {
        return $this->hasOne(InstitutionSubscription::class, 'uni_branch_id');
    }

    public function department(): HasMany
    {
        return $this->hasMany(Department::class, 'uni_branch_id');
    }

    public function semester(): HasMany
    {
        return $this->hasMany(Semester::class, 'uni_branch_id');
    }


    // public function capstone_document(): HasMany
    // {
    //     return $this->hasMany(CapstoneDocument::class, 'cap_doc_id');
    // }

    public function semester()
    {
        return $this->hasMany(Semester::class, 'uni_branch_id');
    }
}