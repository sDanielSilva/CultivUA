<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    use HasFactory;

    protected $fillable = ['result', 'created_at', 'users_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
