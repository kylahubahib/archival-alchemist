<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManuscriptTag extends Model
{
    use HasFactory;
    // Specify the table name if it does nott follow Laravel's convention
    protected $table = 'manuscript_tag';

    // The attributes that are mass assignable.
    protected $fillable = ['manuscript_id', 'tag_id'];

}
