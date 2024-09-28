<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tags extends Model
{
    use HasFactory;

    // Specify the table name if it does not follow Laravel's convention
    protected $table = 'tags';

    // The attributes that are mass assignable.
    protected $fillable = ['tags_name'];


    public function manuscripts(): BelongsToMany
    {
        return $this->belongsToMany(ManuscriptProject::class, 'manuscript_tag', 'tag_id', 'manuscript_id');
    }
    // Optionally, you can define relationships or other model-specific logic here


    public function forum_tag(): HasMany
    {
        return $this->hasMany(ForumTag::class, 'tag_id');
    }

}
