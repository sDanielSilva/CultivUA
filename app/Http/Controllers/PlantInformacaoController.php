<?php
namespace App\Http\Controllers;
use App\Models\UserPlant;
use Illuminate\Http\Request;

class PlantInformacaoController extends Controller
{
    public function show(Request $request, $id = null)
    {
        // Se um user_plant_id foi fornecido na query string
        if ($request->has('user_plant_id')) {
            $userPlantId = $request->query('user_plant_id');
            $userPlant = UserPlant::with('location')
                ->where('id', $userPlantId)
                ->first();

            if ($userPlant) {
                return response()->json([
                    'name' => $userPlant->name,
                    'image' => $userPlant->image,
                    'location' => $userPlant->location ? $userPlant->location->name : 'Localização não disponível',
                ]);
            }

            return response()->json(['error' => 'Planta não encontrada'], 404);
        }

        // Se não houver user_plant_id, retorna todas as plantas
        $userPlants = UserPlant::with('location')->get();

        return response()->json($userPlants);
    }
}
