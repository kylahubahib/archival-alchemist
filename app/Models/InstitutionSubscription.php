<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

use Carbon\Carbon;

class InstitutionSubscription extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'uni_branch_id',
        'plan_id',
        'insub_status',
        'total_amount',
        'insub_content',
        'insub_num_user',
        'start_date',
        'end_date',
        'notify_renewal'
    ];


    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('m/d/Y');
    }

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('m/d/Y');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }

    // public function subscription_history(): HasMany
    // {
    //     return $this->hasMany(SubscriptionHistory::class, 'insub_id');
    // }

    public function institution_admin(): HasMany
    {
        return $this->hasMany(InstitutionAdmin::class, 'insub_id');
    }
}
