<?php

namespace App\Http\Controllers;

use App\Models\Kit;
use Illuminate\Http\Request;

class KitDetailsController extends Controller
{
    public function getKitDetails($kitId)
    {
        // Procurar o kit com a localização e as plantas associadas
        $kit = Kit::with(['locations', 'plants'])->find($kitId);

        if (!$kit) {
            return response()->json(['message' => 'Kit não encontrado'], 404);
        }

        // Estrutura dos dados a ser retornada
        $kitDetails = [
            'nome' => $kit->name,
            'localizacao' => $kit->location->name, // Nome da localização
            'plants' => $kit->plants->map(function ($plant) {
                return [
                    'name' => $plant->name,
                    'species' => $plant->species,
                    'description' => $plant->description,
                    'ideal_temperature' => $plant->ideal_temperature,
                    'ideal_humidity' => $plant->ideal_humidity,
                    'harvest_season' => $plant->harvest_season,
                    'sunlight' => $plant->sunlight,
                    'watering_frequency' => $plant->watering_frequency,
                ];
            }),
        ];

        return response()->json($kitDetails);
    }
}
