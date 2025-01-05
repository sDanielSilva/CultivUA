<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitReading extends Model
{
    use HasFactory;

    protected $table = 'kit_readings';

    protected $fillable = [
        'temperatura',
        'luz',
        'humidade',
        'timestmp',
        'kits_id',
    ];
}
