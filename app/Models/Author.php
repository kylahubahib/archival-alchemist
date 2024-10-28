<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;

class Author extends Model
{
    use HasFactory, Notifiable;
    // Specify the table name if it does nott follow Laravel's convention
    protected $table = 'author';

    // The attributes that are mass assignable.
    protected $fillable = ['man_doc_id', 'user_id'];


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
public function user()
{
    return $this->belongsTo(User::class, 'user_id', 'id'); // Ensure correct mapping
}


}
