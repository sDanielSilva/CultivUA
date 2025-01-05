<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserPlant extends Pivot
{
    use HasFactory;

    protected $table = 'users_plants';

    protected $fillable = ['users_id', 'plants_id','location_id',
        'name', 'image', 'created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function plant()
    {
        return $this->belongsTo(Plant::class, 'plants_id');
    }

    public function kits()
{
    return $this->belongsToMany(Kit::class, 'plants_kits', 'user_plant_id', 'kits_id');
     
}


public function location()
    {
        return $this->belongsTo(Location::class);
    }
}