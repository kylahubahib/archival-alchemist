<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ManuscriptProject extends Model
{
    use HasFactory;

    protected $table = 'manuscripts'; // Explicitly specify the table name

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


    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tags::class, 'manuscript_tag', 'manuscript_id', 'tag_id');
    }

    public function manuscripts()
    {
        return $this->belongsToMany(ManuscriptProject::class, 'manuscript_tag', 'tag_id', 'manuscript_id');
    }

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'author', 'man_doc_id', 'user_id');
    }


}
