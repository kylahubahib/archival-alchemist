<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookView extends Model
{
    use HasFactory;

    protected $table = 'book_views'; // Specify the table name

    // The attributes that are mass assignable
    protected $fillable = [
        'user_id',
        'man_doc_id'
    ];

    /**
     * Define the relationship between BookView and User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define the relationship between BookView and Manuscript.
     */
    public function manuscript()
    {
        return $this->belongsTo(ManuscriptProject::class, 'man_doc_id');
    }
}
