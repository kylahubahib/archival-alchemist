<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Notifications\Notifiable;



class Transaction extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'plan_id',
        'checkout_id',
        'reference_number',
        'trans_amount',
        'payment_method',
        'trans_status'
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    
}
