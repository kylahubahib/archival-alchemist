<?php

namespace App\Models; 

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    use HasFactory;
     // Specify the table name if it does not follow Laravel's convention
    protected $table = 'class';
    // The attributes that are mass assignable.
    
    protected $fillable = ['class_code', 'class_name', 'ins_id', 'stud_id'];
}


