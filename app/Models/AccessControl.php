<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccessControl extends Model
{
    use HasFactory;

    protected $primaryKey = 'access_id';

    protected $fillable = [
        'user_id',
        'role',
        'dashboard_access',
        'users_access',
        'archives_access',
        'subscriptions_and_billings_access',
        'user_reports_access',
        'user_feedbacks_access',
        'terms_and_conditions_access',
        'subscription_plans_access',
        'faqs_access',
        'advanced_access',
        'can_add',
        'can_edit',
        'can_delete',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
