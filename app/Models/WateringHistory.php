<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WateringHistory extends Model
{
    use HasFactory;

    protected $table = 'watering_history';

    /**
     * Os campos que podem ser preenchidos em massa.
     */
    protected $fillable = [
        'users_plants_id',
        'watering_type',
    ];
    public $timestamps = false; // Desativa os timestamps automáticos

    /**
     * Relação com a tabela `users_plants`.
     */
    public function userPlant()
    {
        return $this->belongsTo(UserPlant::class, 'users_plants_id');
    }
}
