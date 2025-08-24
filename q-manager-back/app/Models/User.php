<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the personal access tokens for the user
     */
    public function tokens()
    {
        return $this->morphMany(PersonalAccessToken::class, 'tokenable');
    }

    /**
     * Create a personal access token for the user
     */
    public function createToken($name, $abilities = ['*'])
    {
        $token = bin2hex(random_bytes(32));
        
        $personalAccessToken = $this->tokens()->create([
            'name' => $name,
            'token' => hash('sha256', $token),
            'abilities' => $abilities,
        ]);
        
        return (object) [
            'plainTextToken' => $token,
            'accessToken' => $personalAccessToken
        ];
    }

    /**
     * Get the current access token
     */
    public function currentAccessToken()
    {
        // This would need to be implemented based on the current request
        // For now, return a mock object
        return (object) [
            'delete' => function() {
                // Mock delete function
                return true;
            }
        ];
    }
}
