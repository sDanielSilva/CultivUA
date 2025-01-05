<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['name'];

    // Relacionamento com a tabela de Kits
    public function kits()
    {
        return $this->hasMany(Kit::class);
    }
}
