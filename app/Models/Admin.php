<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['username', 'email', 'password', 'image']; // Campos que podem ser preenchidos.

    protected $hidden = ['password']; // Esconde o password na conversão para array ou JSON.

    public function blogPosts()
    {
        return $this->hasMany(BlogPost::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
