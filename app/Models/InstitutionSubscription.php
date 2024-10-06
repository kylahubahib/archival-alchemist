<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstitutionSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'uni_branch_id',
        'plan_id',
        'insub_status',
        'total_amount',
        'insub_content',
        'insub_num_user',
        'start_date',
        'end_date'
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function university_branch(): BelongsTo
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }
}
 