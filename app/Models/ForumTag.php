<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ForumTag extends Model
{
    use HasFactory;

    protected $table = 'forum_tags_table';
    protected $fillable = ['name'];

    public function posts()
    {
        return $this->belongsToMany(ForumPost::class, 'forum_post_tags_table');
    }
}