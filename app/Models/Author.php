<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Author extends Model
{
    use HasFactory, Notifiable;
    
    // Specify the table name if it does nott follow Laravel's convention
    protected $table = 'author';

    // The attributes that are mass assignable.
    protected $fillable = ['man_doc_id', 'user_id', 'permission_id'];


    //Foreign key
    public function ManuscriptProject(): BelongsToMany
    {
        return $this->belongsToMany(ManuscriptProject::class, 'man_doc_id');
    }

    // //One to may relationship
    // public function user(): BelongsToMany
    // {
    //     return $this->belongsToMany(User::class, 'user_id');
    // }

    // In Author.php model
    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id', 'id'); // Ensure correct mapping
    // }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }



}
