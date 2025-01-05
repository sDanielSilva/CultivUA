<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = ['message', 'type', 'is_read', 'users_id', 'admin'];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
