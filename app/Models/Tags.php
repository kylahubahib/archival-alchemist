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


    /**
     * Many-to-Many relationship with Manuscripts.
     * A tag can be linked to multiple manuscripts.
     */
    public function ManuscriptProject(): BelongsToMany
    {
        return $this->belongsToMany(ManuscriptProject::class, 'manuscript_tag', 'tag_id', 'manuscript_id');
    }

    public function forum_tag(): HasMany
    {
        return $this->hasMany(ForumTag::class, 'tag_id');
    }

}
