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
        'uni_branch_id',
        'role',
        'super_dashboard_access',
        'super_users_access',
        'super_archives_access',
        'super_subscription_billing_access',
        'super_user_reports_access',
        'super_user_feedbacks_access',
        'super_terms_and_conditions_access',
        'super_subscription_plans_access',
        'super_faqs_access',
        'super_advanced_access',
        'ins_students_access',
        'ins_faculties_access',
        'ins_coadmins_access',
        'ins_departments_access',
        'ins_sections_access',
        'ins_subscription_billing_access',
        'ins_archives_access',
        'ins_chat_with_us_access',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
