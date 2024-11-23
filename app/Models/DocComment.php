<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocComment extends Model
{
    use HasFactory, SoftDeletes;

    // Define the table name explicitly if it's not the plural form of the model
    protected $table = 'doc_comments';

    // Define the fillable attributes for mass assignment
    protected $fillable = [
        'content',
        'body',
        'parent_id',
        'commentable_type',
        'man_doc_id',
        'user_id',
        'edited_at',
    ];

    // Cast the edited_at attribute as a date
    protected $dates = ['edited_at'];

    /**
     * Get the user that owns the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the manuscript that the comment belongs to.
     */
    public function manuscript()
    {
        return $this->belongsTo(ManuscriptProject::class, 'man_doc_id');
    }

    /**
     * Get the parent comment if there is one.
     */
    // Define replies relationship
    public function replies()
    {
        return $this->hasMany(self::class, 'parent_id');
    }
    /**
     * Get the commentable model (polymorphic relationship).
     */
    public function commentable()
    {
        return $this->morphTo();
    }
}
