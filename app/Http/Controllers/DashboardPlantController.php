<?php

namespace App\Http\Controllers;
use App\Models\UserPlant; // Modelo da tabela
use App\Models\Kit; // Modelo da tabela
use App\Models\Plant; // Modelo da tabela
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\KitReading; // Modelo da tabela

class DashboardPlantController extends Controller
{
    public function getUserPlants($userId)
    {
        // Procura as plantas associadas ao utilizador
        $plants = Plant::whereHas('users', function ($query) use ($userId) {
            $query->where('users.id', $userId);
        })->get();

        return response()->json($plants);
    }
    public function getUserPlantsWithKits($userId)
    {
        $plants = DB::table('users_plants')
            ->join('plants', 'users_plants.plants_id', '=', 'plants.id')
            ->leftJoin('plants_kits', 'users_plants.id', '=', 'plants_kits.user_plant_id')
            ->leftJoin('kits', 'plants_kits.kits_id', '=', 'kits.id')
            ->where('users_plants.users_id', $userId)
            ->select(
                'users_plants.id as user_plant_id',  // ID único na tabela users_plants
                'plants.*',
                'kits.id as kit_id',  // ID do kit
                'kits.name as kit_name',
                'kits.codigo as kit_codigo'
            )
            ->get();

        return response()->json($plants);
    }


    public function getPlantById($id)
    {
        $plant = Plant::with(['usersPlants.kits'])  // Relacionamento com kits através de users_plants
            ->find($id);

        if (!$plant) {
            return response()->json(['error' => 'Plant not found'], 404);
        }

        return response()->json($plant);
    }

    // Exemplo de Controller
    public function show($id)
    {
        // Carregar a planta com os kits associados
        $plantData = Plant::with('kits')->find($id);

        // Verifica se a planta foi encontrada
        if (!$plantData) {
            return response()->json(['error' => 'Planta não encontrada'], 404);
        }

        // Retornar a planta com os kits
        return response()->json($plantData);
    }




    public function updatePlantImage($id, Request $request)
    {
        try {
            // Procurar o user e a planta com o ID fornecido
            $userPlant = UserPlant::find($id);

            if (!$userPlant) {
                return response()->json(['error' => 'User plant not found'], 404);
            }

            // Verificar se a imagem foi fornecida no request
            if ($request->has('image')) {
                // A imagem será um base64, então simplesmente guardamos a string base64 na coluna 'image'
                $imageData = $request->image;

                // Guardar a string base64 diretamente no banco de dados
                $userPlant->image = $imageData;
                $userPlant->save();

                return response()->json(['message' => 'Imagem atualizada com sucesso']);
            } else {
                return response()->json(['error' => 'Nenhuma imagem fornecida'], 400);
            }
        } catch (\Exception $e) {
            // Capturar qualquer erro inesperado
            return response()->json(['error' => 'Erro ao processar a requisição: ' . $e->getMessage()], 500);
        }
    }







    public function addKitToPlant(Request $request, $plantId)
    {
        // Validação dos dados
        $validated = $request->validate([
            'kitId' => 'required|exists:kits,id',
        ]);

        // Recupera a planta
        $plant = Plant::find($plantId);

        if (!$plant) {
            return response()->json(['error' => 'Planta não encontrada'], 404);
        }

        // Associa o kit à planta (supondo que a relação entre as tabelas seja feita através de plants_kits)
        $plant->kits()->attach($validated['kitId']);

        return response()->json(['message' => 'Kit associado à planta com sucesso']);
    }

    public function associateKit(Request $request)
    {
        $validated = $request->validate([
            'plantId' => 'required|exists:users_plants,id',
            'kitId' => 'required|exists:kits,id',
        ]);

        $kit = Kit::find($validated['kitId']);
        $kit->update(['isAssociated' => true]);

        return response()->json(['message' => 'Kit associado com sucesso!']);
    }



    public function getKitReadings($kitId)
    {
        // Recupera as leituras do kit com o ID fornecido
        $readings = KitReading::where('kits_id', $kitId)->latest()->first(); // Obtem a última leitura

        if (!$readings) {
            return response()->json(['message' => 'No readings found'], 404);
        }

        return response()->json($readings);
    }
}
