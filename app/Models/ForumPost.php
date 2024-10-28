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
        'tags',
        'user_id',
    ];

    protected $casts = [
        'tags' => 'array', // Cast tags as an array
    ];

    public function user()
    {
        return $this->belongsTo(User::class); // Assuming you have a User model
    }
}

