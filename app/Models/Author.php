<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Author extends Model
{
    use HasFactory;
    // Specify the table name if it does nott follow Laravel's convention
    protected $table = 'author';

    // The attributes that are mass assignable.
    protected $fillable = ['man_doc_id', 'user_id'];


    //Foreign key
    public function ManuscriptProject(): BelongsToMany
    {
        return $this->belongsToMany(ManuscriptProject::class, 'man_doc_id');
    }

//One to may relationship
    public function user(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_id');
    }


}
