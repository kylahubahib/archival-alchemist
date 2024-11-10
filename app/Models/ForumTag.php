<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ForumTag extends Model
{
    use HasFactory;

    protected $table = 'forum_tags';
    protected $fillable = ['name'];

    // Define the many-to-many relationship with ForumPost
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(ForumPost::class, 'forum_post_forum_tag', 'forum_tag_id', 'forum_post_id');
    }
}
