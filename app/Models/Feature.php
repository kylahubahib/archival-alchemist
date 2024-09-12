<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Feature extends Model
{
    use HasFactory;

    protected $fillable = [
        'feature_name'
    ];

    public function plan_feature(): HasMany
    {
        return $this->hasMany(PlanFeature::class, 'feature_id');
    }
}
