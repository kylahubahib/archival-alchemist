<?php

namespace App\Models;


use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstitutionAdmin extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'insub_id',
        'ins_admin_proof'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function institution_subscription(): BelongsTo
    {
        return $this->belongsTo(InstitutionSubscription::class, 'insub_id');
    }


}
