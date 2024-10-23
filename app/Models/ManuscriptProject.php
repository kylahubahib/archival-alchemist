<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;

class ManuscriptProject extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'manuscripts';

    protected $fillable = [
        'man_doc_title',
        'man_doc_content',
        'man_doc_status',
        'man_doc_adviser',
        'man_doc_author',
        'man_doc_view_count',
        'is_publish',
        'man_doc_rating',
        'class_id',
    ];

    /**
     * Get the student that owns the manuscript project.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }


     /**
     * Many-to-Many relationship with Tags.
     * A manuscript can have multiple tags.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tags::class, 'manuscript_tag', 'manuscript_id', 'tag_id');
    }
    // author: This refers to a method in the ManuscriptProject model that defines the relationship to the Author model.
    //  It's not referring to the author table directly; instead, it refers to the relationship method.
    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'author', 'man_doc_id', 'user_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'man_doc_id');
    }

    public function revision_history()
    {
        return $this->hasMany(RevisionHistory::class, 'man_doc_id');
    }
    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_code');
    }

    //A manuscript can have many ratings.
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
