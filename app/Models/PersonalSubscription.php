<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonalSubscription extends Model
{
    use HasFactory;

    protected $primaryKey = 'persub_id';

    protected $fillable = [
        'user_id',
        'plan_id',
        'persub_status',
        'total_amount',
        'start_date',
        'end_date'
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
