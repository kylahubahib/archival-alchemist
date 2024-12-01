<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
//use Laravel\Cashier\Billable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;


use Google\Client as GoogleClient;


class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'uni_id_num',
        'user_pnum',
        'user_aboutme',
        'user_type',
        'user_status',
        'is_premium',
        'user_pic',
        'user_dob',
        'is_affiliated',
        'google_user_id',
        'google_access_token',
        'google_refresh_token',
        'google_token_expiry'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_premium' => 'boolean',
        ];
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class, 'user_id');
    }

    public function institution_admin(): HasOne
    {
        return $this->hasOne(InstitutionAdmin::class, 'user_id');
    }

    public function personal_subscription(): HasOne
    {
        return $this->hasOne(PersonalSubscription::class, 'user_id');
    }

    public function custom_content(): HasMany
    {
        return $this->hasMany(CustomContent::class, 'user_id');
        }

    public function manuscripts(): BelongsToMany
    {
        return $this->belongsToMany(ManuscriptProject::class, 'author', 'user_id', 'man_doc_id');
    }


    public function forum(): HasMany
    {
        return $this->hasMany(Forum::class, 'user_id');
    }

    public function post(): HasMany
    {
        return $this->hasMany(Post::class, 'user_id');
    }

    public function user_report(): HasMany
    {
        return $this->hasMany(UserReport::class, 'reporter_id', 'reported_id');
    }

    public function chat(): HasMany
    {
        return $this->hasMany(Chat::class, 'from_id', 'to_id');
    }

    public function report_type(): HasMany
    {
        return $this->hasMany(ReportType::class, 'user_id');
    }

    public function notification(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class, 'user_id');
    }

    public function transaction(): HasMany
    {
        return $this->hasMany(Transaction::class, 'user_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'user_id');
    }

    public function revision_history()
    {
        return $this->hasMany(RevisionHistory::class, 'ins_id');
    }
    public function classes()
    {
        return $this->belongsToMany(ClassModel::class, 'class_student', 'stud_id', 'class_id');
    }


    //A user can have many ratings.
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    // Define the relationship with the Author model
     // If a User has many Authors
     public function authors()
     {
         return $this->hasMany(Author::class, 'user_id', 'id');
     }

     public function section()
     {
         return $this->hasMany(Section::class, 'ins_id');
     }

     public function access_control(): HasOne
     {
         return $this->hasOne(AccessControl::class, 'user_id');
     }
     public function user_log(): HasMany
     {
         return $this->hasMany(UserLog::class, 'user_id');
     }

    // Google access tokens expires after one hour so this method will automatically
    // create a new access token using the refresh token.
    // Each time you need to make a request to Google Drive or Docs APIs,
    // call refreshGoogleToken() to ensure the token is valid.
    public function refreshGoogleToken()
    {
        if (Carbon::now()->greaterThan($this->google_token_expiry)) {
            $client = new GoogleClient();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->refreshToken($this->google_refresh_token);

            $newAccessToken = $client->getAccessToken();
            $this->update([
                'google_access_token' => $newAccessToken['access_token'],
                'google_token_expiry' => Carbon::now()->addSeconds($newAccessToken['expires_in']),
            ]);
        }
    }

        public function forumComments()
    {
        return $this->hasMany(ForumComment::class);
    }

    public function groupMembers()
    {
        return $this->hasMany(GroupMember::class, 'section_id');
    }


        // Other model properties and methods

    /**
     * Get all the books the user has viewed.
     */
    public function bookViews()
    {
        return $this->hasMany(BookView::class);
    }

    /**
     * Get all the manuscripts the user has viewed.
     */
    public function viewedManuscripts()
    {
        return $this->belongsToMany(ManuscriptProject::class, 'book_views', 'user_id', 'man_doc_id');
    }
}
