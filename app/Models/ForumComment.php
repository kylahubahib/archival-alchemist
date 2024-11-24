<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumComment extends Model
{
    use HasFactory;

    protected $fillable = ['forum_post_id', 'user_id', 'comment'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function forumPost()
    {
        return $this->belongsTo(ForumPost::class);
    }
}
