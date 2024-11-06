<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class ClassStudent extends Model
{
    use HasFactory;
     // Specify the table name if it does not follow Laravel's convention
     protected $table = 'class_students';
     
    protected $fillable = ['class_id', 'stud_id'];

    // public function class(): BelongsTo
    // {
    //     return $this->belongsTo(ClassModel::class, 'class_id');
    // }

    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class, 'stud_id');
    // }
}

