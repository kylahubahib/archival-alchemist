<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
//use Laravel\Cashier\Billable;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class User extends Authenticatable
{
    use HasFactory, Notifiable;

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

    public function faculty(): HasOne
    {
        return $this->hasOne(Faculty::class, 'user_id');
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

}
