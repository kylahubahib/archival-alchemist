<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

class Semester extends Model
{
    use HasFactory;

    protected $table = 'semesters';

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'uni_branch_id',
        'status',
        'school_year'
    ];

    /**
     * Boot the model and generate a random unique ID.
     */
    protected static function booted()
    {
        static::creating(function ($semester) {
            $semester->id = mt_rand(1000000000, 9999999999);

            while (self::where('id', $semester->id)->exists()) {
                $semester->id = mt_rand(1000000000, 9999999999);
            }
        });
    }


    /**
     * Accessor for formatted start_date
     */
    public function getStartDateAttribute($value): ?string
    {
        return $value ? Carbon::parse($value)->format('m/d/Y') : null;
    }

    /**
     * Accessor for formatted end_date
     */
    public function getEndDateAttribute($value): ?string
    {
        return $value ? Carbon::parse($value)->format('m/d/Y') : null;
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

}
