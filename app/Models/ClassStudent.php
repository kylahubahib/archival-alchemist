<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassStudent extends Model
{
    use HasFactory;
     // Specify the table name if it does not follow Laravel's convention
     protected $table = 'class_students';
     
    protected $fillable = ['class_id', 'stud_id'];

    
}

