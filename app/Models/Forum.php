<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Forum extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'forum_title',
        'forum_status',
        'forum_desc',
        'forum_type',
        'forum_attachment',
        'forum_view_count',
        'forum_like_count',
        'forum_dislike_count'
    ];

    public function forum_tag(): HasMany
    {
        return $this->hasMany(ForumTag::class, 'forum_id');
    }

    public function post(): HasMany
    {
        return $this->hasMany(Post::class, 'forum_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }


}
