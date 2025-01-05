<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'name',
        'species',
        'description',
        'ideal_temperature',
        'ideal_humidity',
        'ideal_light',
        'buffer_percentage',
        'watering_frequency',
        'origin',
        'min_dimension',
        'max_dimension',
        'cycle',
        'pruning_months',
        'maintenance',
        'growth_rate',
        'indoor',
        'flower',
        'fruit',
        'edible_fruit',
        'edible_leaves',
        'medicinal',
        'cuisine',
        'poisonous_to_pets',
        'poisonous_to_humans',
        'harvest_season',
        'watering_guide',
        'pruning_guide',
        'sunlight_guide',
    ];


    // Relacionamento com a tabela de Kits
    public function kit()
    {
        return $this->belongsTo(Kit::class, 'kits_id');
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'users_plants', 'plants_id', 'users_id');
    }

    public function kits()
    {
        return $this->belongsToMany(Kit::class, 'plants_kits', 'user_plant_id', 'kits_id');
    }


    public function usersPlants()
    {
        return $this->hasMany(UserPlant::class, 'plants_id'); // Relacionamento com users_plants
    }


}
