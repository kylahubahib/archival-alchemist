<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class Department extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'departments';

    protected $fillable = [
        'uni_branch_id',
        'dept_name', 
        'added_by',
        'dept_acronym'
    ];

    protected static function booted()
    {
        static::creating(function ($dept) {
            $dept->id = mt_rand(1000000000, 9999999999);  
            while (self::where('id', $dept->id)->exists()) {
                $dept->id = mt_rand(1000000000, 9999999999);
            }
        });
    }

    public function course(): HasMany
    {
        return $this->hasMany(Course::class, 'dept_id');
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    
   


}
