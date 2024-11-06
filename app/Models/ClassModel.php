<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Notifications\Notifiable;

class ClassModel extends Model
{
    use HasFactory, Notifiable;
     // Specify the table name if it does not follow Laravel's convention
    protected $table = 'class';
    // The attributes that are mass assignable.

    protected $fillable = ['class_code', 'class_name', 'ins_id', 'stud_id'];
    // Ensure this is not set to false
    public $timestamps = true;


    public function manuscripts()
    {
        return $this->hasMany(ManuscriptProject::class, 'class_code');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'class_students', 'class_id', 'stud_id');
    }


}


