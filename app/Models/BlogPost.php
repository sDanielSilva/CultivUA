<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'status',
        'is_highlighted',
        'categoria_id',
        'admins_id',
        'image',
        'reading_time',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoria_id');
    }
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admins_id');
    }
}
