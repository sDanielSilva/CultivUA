<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kit extends Model
{
    use HasFactory;

    protected $fillable = ['codigo', 'name', 'isAssociated'];

    // Relacionamento com a tabela de Locations

    // Relacionamento com a tabela de Plants
    public function plants()
    {
        return $this->hasMany(Plant::class, 'kits_id');
    }

    public function usersPlants()
    {
        return $this->belongsToMany(UserPlant::class, 'plants_kits', 'kits_id', 'user_plant_id')
            ->withTimestamps(); // Relacionamento com users_plants através da tabela de junção
    }

/*     public static function gerarCodigoUnico()
    {
        do {
            $codigo = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('codigo', $codigo)->exists());

        return $codigo;
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->codigo = self::gerarCodigoUnico();
        });
    } */
}
