<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'user_id',
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
    public function access_control(): HasOne
    {
        return $this->hasOne(AccessControl::class, 'user_id');
    }
    public function user_log(): HasMany
    {
        return $this->hasMany(UserLog::class, 'user_id');
    }
}
