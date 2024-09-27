<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'forum_id',
        'post_content',
        'post_view_count',
        'post_like_count'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function forum(): BelongsTo
    {
        return $this->belongsTo(Forum::class, 'forum_id');
    }

}
