<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPlant;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Plant;
use App\Models\Location;
use App\Models\Kit;
use App\Models\PlantsKit;

class UserPlantController extends Controller
{
    public function updatePlant(Request $request, $id)
    {
        try {
            Log::info('Payload recebido para atualização:', $request->all());

            // Validação básica
            $request->validate([
                'location_id' => 'nullable|exists:locations,id',
                'name' => 'nullable|string|max:255',
                'image' => 'nullable|string',
            ]);

            // Procurar o registro pelo ID fornecido
            $userPlant = UserPlant::findOrFail($id);

            // Atualizar os dados
            $userPlant->update([
                'location_id' => $request->location_id,
                'name' => $request->name,
                'image' => $request->image,
            ]);

            Log::info('Registro atualizado:', $userPlant->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Planta atualizada com sucesso.',
                'data' => $userPlant,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar planta:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar planta.',
            ], 500);
        }
    }




    public function getLocationByUserId($user_plant_id)
    {
        // Encontre o registro na tabela users_plants com o user_plant_id
        $userPlant = UserPlant::find($user_plant_id);

        if (!$userPlant) {
            return response()->json(['error' => 'Associação de planta não encontrada'], 404);
        }

        // Obter a localização diretamente pelo relacionamento
        $location = $userPlant->location;  // O relacionamento 'location' já está definido no modelo UserPlant

        if (!$location) {
            return response()->json(['error' => 'Localização não encontrada'], 404);
        }

        return response()->json(['location' => $location]);
    }




    public function getUserPlantById($user_plant_id)
    {
        try {
            // Procurar a informação na tabela users_plants pelo user_plant_id
            $userPlant = UserPlant::where('id', $user_plant_id)->first();

            if (!$userPlant) {
                return response()->json(['error' => 'Planta não encontrada para o ID fornecido'], 404);
            }

            // Verifica se os campos 'name' e 'image' estão vazios ou nulos
            $name = $userPlant->name ?: null;
            $image = $userPlant->image ?: null;

            // Caso o nome e imagem estejam vazios, retorna os valores de 'user_plant'
            if (!$name && !$image) {
                return response()->json(['user_plant' => $userPlant], 200);
            }

            // Caso contrário, obtém os dados da planta (tabela 'plants')
            $plant = $userPlant->plant; // Assume que existe o relacionamento 'plant' no modelo UserPlant

            if (!$plant) {
                return response()->json(['error' => 'Planta associada não encontrada'], 404);
            }

            // Se os campos 'name' e 'image' estiverem preenchidos, retorna os dados de 'plant'
            return response()->json([
                'user_plant' => [
                    'id' => $userPlant->id,
                    'users_id' => $userPlant->users_id,
                    'plants_id' => $userPlant->plants_id,
                    'location_id' => $userPlant->location_id,
                    'name' => $name ?: $plant->name, // Se 'name' da tabela users_plants estiver vazio, pega o da tabela plants
                    'image' => $image ?: $plant->image, // Se 'image' da tabela users_plants estiver vazio, pega o da tabela plants
                    'created_at' => $userPlant->created_at,
                    'updated_at' => $userPlant->updated_at,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao procurar a planta: ' . $e->getMessage()], 500);
        }
    }

}
