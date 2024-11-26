<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = ['uni_branch_id', 'name', 'start_date', 'end_date', 'status'];

    // Generate random numbers as id
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = mt_rand(1000000000, 9999999999); 
            }
        });
    }

    public function university_branch()
    {
        return $this->belongsTo(UniversityBranch::class, 'uni_branch_id');
    }
}

