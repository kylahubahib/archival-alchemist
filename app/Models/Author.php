<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;

class Author extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'author';
    public $incrementing = false;  // Disable auto-incrementing since you have composite keys

    protected $fillable = ['man_doc_id', 'user_id', 'permission_id'];

    // Define the composite primary key
    protected $primaryKey = ['man_doc_id', 'user_id'];

    // Override getKeyName() method
    public function getKeyName()
    {
        return 'man_doc_id'; // Use a single key for standard queries
    }

    // Custom method to handle composite key deletion
    public static function deleteByCompositeKey($man_doc_id, $user_id)
    {
        return self::where('man_doc_id', $man_doc_id)
            ->where('user_id', $user_id)
            ->delete();
    }

    // Define relationship with User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Define relationship with ManuscriptProject
    public function ManuscriptProject(): BelongsTo
    {
        return $this->belongsToMany(ManuscriptProject::class, 'author', 'user_id', 'man_doc_id');
    }
}
