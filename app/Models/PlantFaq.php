<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlantFaq extends Model
{
    use HasFactory;

    protected $fillable = [
        'plant_id',
        'question',
        'answer',
    ];

    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }
}
