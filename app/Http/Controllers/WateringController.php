<?php

namespace App\Http\Controllers;

use App\Models\WateringHistory;
use Illuminate\Http\Request;
use App\Models\Plant;

class WateringController extends Controller
{
    /**
     * Regista uma rega manual.
     * Endpoint: POST /watering/manual
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'users_plants_id' => 'required|exists:users_plants,id',
            'watering_type' => 'required|in:manual,automatic',
        ]);

        $wateringEntry = WateringHistory::create($validated);

        return response()->json([
            'message' => 'Entrada de rega criada com sucesso.',
            'data' => $wateringEntry,
        ], 201);
    }


    public function getWateringData($userPlantId)
    {
        // Obter histórico de rega
        $wateringHistory = WateringHistory::where('users_plants_id', $userPlantId)->get(['created_at']);

        // Obter frequência de rega
        $plant = Plant::join('users_plants', 'plants.id', '=', 'users_plants.plants_id')
            ->where('users_plants.id', $userPlantId)
            ->first(['plants.watering_frequency']);

        return response()->json([
            'watering_history' => $wateringHistory,
            'watering_frequency' => $plant->watering_frequency
        ]);
    }

    /**
     * Retorna o histórico de regas de uma planta.
     * Endpoint: GET /watering/history/{users_plants_id}
     */
    public function history($usersPlantsId)
    {
        // Verificar se a planta associada existe
        $history = WateringHistory::where('users_plants_id', $usersPlantsId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($history);
    }
}
