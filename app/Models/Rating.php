<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;
    protected $table = 'ratings';
    protected $fillable = ['user_id', 'manuscript_id', 'rating'];


    //A rating belongs to a user.

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    //A rating belongs to a manuscript.
    public function manuscript()
    {
        return $this->belongsTo(ManuscriptProject::class);
    }

}
