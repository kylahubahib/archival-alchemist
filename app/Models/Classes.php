<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classes extends Model
{
    use HasFactory;

    protected $primaryKey = 'class_id';

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'fac_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'sec_id');
    }

    public function class_student(): HasMany
    {
        return $this->hasMany(ClassStudent::class, 'class_id');
    }

    public function capstone_document(): HasMany
    {
        return $this->hasMany(CapstoneDocument::class, 'cap_doc_id');
    }
}
