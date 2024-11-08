<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $primaryKey = 'plan_id';

    protected $fillable = [
        'plan_name',
        'plan_price',
        'plan_term',
        'plan_type',
        'plan_user_num',
        'plan_discount',
        'free_trial_days',
    ];

    public function institution_subscription(): HasMany
    {
        return $this->hasMany(InstitutionSubscription::class, 'plan_id');
    }

    public function personal_subscription(): HasMany
    {
        return $this->hasMany(PersonalSubscription::class, 'plan_id');
    }
}
