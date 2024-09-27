<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class UserReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'reported_id',
        'report_type',
        'report_attachment',
        'report_desc',
        'report_status',
        'closed_at'
    ];
}
