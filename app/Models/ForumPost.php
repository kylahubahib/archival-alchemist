<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ForumPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'user_id', 
        'viewCount',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($post) {
            \Log::info('Created At:', [$post->created_at]);
        });
    }

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

    // In Laravel, within the Post model
    public function getFormattedCreatedAtAttribute()
        {
            return $this->created_at ? $this->created_at->toDateTimeString() : null;
        }
    


    // Add this accessor method to handle unnamed tags consistently
    public function getFormattedTagsAttribute()
    {
        return $this->tags->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name ?? 'Unnamed Tag',
            ];
        });
    }

}