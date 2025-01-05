<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlantsKit extends Model
{
    use HasFactory;

    /**
     * A tabela associada ao modelo.
     *
     * @var string
     */
    protected $table = 'plants_kits';

    /**
     * As colunas que podem ser preenchidas em massa.
     *
     * @var array
     */
    protected $fillable = [
        'user_plant_id', // ID da planta do utilizador
        'kits_id',       // ID do kit associado
    ];

    /**
     * Indica se o modelo deve usar timestamps.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Relacionamento com a tabela de plantas do utilizador.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userPlant()
    {
        return $this->belongsTo(UserPlant::class, 'user_plant_id');
    }

    /**
     * Relacionamento com a tabela de kits.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kit()
    {
        return $this->belongsTo(Kit::class, 'kits_id');
    }
}
