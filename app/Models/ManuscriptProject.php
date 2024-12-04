<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class ManuscriptProject extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'manuscripts';

    protected $fillable = [
        'man_doc_title',
        'man_doc_description',
        'man_doc_description',
        'man_doc_visibilty',
        'man_doc_content',
        'man_doc_status',
        'man_doc_adviser',
        'man_doc_author',
        'man_doc_view_count',
        'is_publish',
        'man_doc_rating',
        'class_code',
        'group_id',
        'section_id',
        'class_id',
        'uni-branch_id'
    ];

    /**
     * Get the student that owns the manuscript project.
     */
    // public function student(): BelongsTo
    // {
    //     return $this->belongsTo(Student::class, 'student_id');
    // }


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
        return $this->hasMany(Rating::class, 'manuscript_id', 'id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    // Other model properties and methods

    /**
     * Get all the users who have viewed this manuscript.
     */
    public function bookViews()
    {
        return $this->hasMany(BookView::class, 'man_doc_id');
    }

    /**
     * Get all the users who have viewed this manuscript.
     */
    public function viewers()
    {
        return $this->belongsToMany(User::class, 'book_views', 'man_doc_id', 'user_id');
    }

    public static function booted()
    {

        static::updated(function ($manuscript) {
            if ($manuscript->isDirty('is_publish') && $manuscript->is_publish) {

                Log::

                    // Get the related section, course, department, and university branch
                    $section = $manuscript->section;
                $course = $section->course ?? null;
                $department = $course->department ?? null;
                $universityBranch = $department->universityBranch ?? null;

                if (!$universityBranch) {
                    return; // If the hierarchy is incomplete, skip further logic
                }

                // Count public manuscripts in the same hierarchy
                $publicCount = Manuscript::where('man_doc_visibility', 'Public')
                    ->whereHas('section.course.department.universityBranch', function ($query) use ($universityBranch) {
                        $query->where('id', $universityBranch->id);
                    })
                    ->count();

                if ($publicCount < 3) {
                    // Update the visibility of the current manuscript
                    $manuscript->update(['man_doc_visibility' => 'Public']);

                    // Update additional manuscripts within the hierarchy
                    Manuscript::where('man_doc_visibility', '!=', 'Public')
                        ->whereHas('section.course.department.university_branch', function ($query) use ($universityBranch) {
                            $query->where('id', $universityBranch->id);
                        })
                        ->orderBy('created_at', 'asc')
                        ->take(3 - $publicCount)
                        ->update(['man_doc_visibility' => 'Public']);
                }
            }
        });
    }
}
