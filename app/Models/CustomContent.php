<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CustomContent extends Model
{
    use HasFactory;

    protected $table = 'custom_contents';

    protected $fillable = [
        'user_id',
        'content_type',
        'content_title',
        'content_text',
        'subject',
        'content_status'
    ];

    //Formatting the timestamp

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
