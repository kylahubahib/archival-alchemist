<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    use HasFactory;

    //protected $primaryKey = 'uni_id';
    public $incrementing = false;

    protected $keyType = 'bigInteger';

    protected $fillable = [
        'uni_name'
    ];

    protected static function booted()
    {
        static::creating(function ($uni) {
            $uni->id = mt_rand(1000000000, 9999999999);  
            while (self::where('id', $uni->id)->exists()) {
                $uni->id = mt_rand(1000000000, 9999999999);
            }
        });
    }

    public function university_branch(): HasMany
    {
        return $this->hasMany(UniversityBranch::class, 'uni_id');
    }
}
