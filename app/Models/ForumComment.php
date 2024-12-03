<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumComment extends Model
{
    use HasFactory;

    protected $fillable = ['forum_post_id', 'user_id', 'comment', 'parent_id', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function forumPost()
    {
        return $this->belongsTo(ForumPost::class, 'forum_post_id');
    }

     // Relationship to fetch replies for a comment
     public function replies()
     {
         return $this->hasMany(ForumComment::class, 'parent_id')->with('user');
     }
 
     // Relationship to fetch the parent comment (if any)
     public function reply_parent()
     {
         return $this->belongsTo(ForumComment::class, 'parent_id');
     }
}
