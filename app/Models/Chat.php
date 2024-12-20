<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

use Illuminate\Notifications\Notifiable;


class Chat extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'from_id',
        'to_id',
        'chat_message',
        'chat_is_seen'
    ];
}
