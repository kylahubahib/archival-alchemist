<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

use Illuminate\Notifications\Notifiable;

class CustomContent extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'custom_contents';

    protected $fillable = [
        'user_id',
        'content_type',
        'content_title',
        'content_text',
        'subject',
        'content_status'
    ];

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('Y-m-d');
    }

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('Y-m-d');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    
}
