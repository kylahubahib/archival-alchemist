<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class SubscriptionPlan extends Model
{
    use HasFactory, Notifiable;

    public $incrementing = false;

    protected $keyType = 'bigInteger';

    protected $fillable = [ 
        'plan_name',
        'plan_price',
        'plan_term',
        'plan_type',
        'plan_user_num',
        'plan_discount',
        'free_trial_days',
        'plan_status',
        'plan_text'
    ];

    protected static function booted()
    {
        static::creating(function ($subscriptionPlan) {
            $subscriptionPlan->id = mt_rand(1000000000, 9999999999);  
            while (self::where('id', $subscriptionPlan->id)->exists()) {
                $subscriptionPlan->id = mt_rand(1000000000, 9999999999);
            }
        });
    }

    public function institution_subscription(): HasMany 
    {
        return $this->hasMany(InstitutionSubscription::class, 'plan_id');
    }

    public function personal_subscription(): HasMany 
    {
        return $this->hasMany(PersonalSubscription::class, 'plan_id');
    }

    public function plan_feature(): HasMany
    {
        return $this->hasMany(PlanFeature::class, 'plan_id');
    }

    public function transaction(): HasMany
    {
        return $this->hasMany(Transaction::class, 'plan_id');
    }
}
