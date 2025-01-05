<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens; // Importação correta

class User extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;

    protected $fillable = [
        'username', 'password', 'email', 'imagem', 'newsletter'
    ];

    // Esconde o password na conversão para array ou JSON
    protected $hidden = ['password'];

    public function plants()
    {
        return $this->belongsToMany(Plant::class, 'users_plants');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function quizResults()
    {
        return $this->hasMany(QuizResult::class);
    }
}
