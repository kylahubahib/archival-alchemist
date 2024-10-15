<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RevisionHistory extends Model
{
    use HasFactory;

    protected $table = 'revision_history'; 

    protected $fillable = [
        'comment',
        'man_doc_id',
        'faculty_id',
        'uploaded_at',
        'status'
    ];


    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('m/d/Y'); 
    }
    
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('m/d/Y'); 
    }

    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(ManuscriptProject::class, 'man_doc_id');
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }
    


}
