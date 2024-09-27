<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['tag_name'];
    
    public function forum_tag(): HasMany
    {
        return $this->hasMany(ForumTag::class, 'tag_id');
    }

   
}
