<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'user_id', 
        'viewCount',
    ];

    // Removed 'tags' from fillable and casts since tags are managed through a pivot table.
    // If you are storing tags directly in the posts table, keep the casts line.
    // Otherwise, you can remove it.
    
    public function tags()
    {
        return $this->belongsToMany(ForumTag::class, 'forum_post_forum_tag', 'forum_post_id', 'forum_tag_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class); 
    }

    public function incrementViewCount()
    {
        $this->increment('viewCount');
    }

}