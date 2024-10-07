<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'man_doc_id',
        'user_id', // Add user_id here
    ];
    /**
     * Get the user that owns the favorite.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the manuscript that is bookmarked.
     */
    public function ManuscriptProject()
    {
        return $this->belongsTo(ManuscriptProject::class, 'man_doc_id');
    }

}
