<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ManuscriptTag extends Model
{
    use HasFactory;
    // Specify the table name if it does nott follow Laravel's convention
    protected $table = 'manuscript_tag';

    // The attributes that are mass assignable.
    protected $fillable = ['manuscript_id', 'tag_id'];


    //Foreign key
    public function ManuscriptProject(): BelongsToMany
    {
        return $this->belongsToMany(ManuscriptProject::class, 'manuscript_id');
    }

//One to may relationship
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tags::class, 'tag_id');
    }


}
