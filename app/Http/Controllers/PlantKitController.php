<?php

namespace App\Http\Controllers;
use App\Models\Plant;
use Illuminate\Http\Request;
use App\Models\Kit;
use App\Models\PlantsKit;
use App\Models\UsersPlant;
use Illuminate\Support\Facades\Log;

class PlantKitController extends Controller
{
    public function associateKit(Request $request, $userPlantId)
    {
        $request->validate([
            'codigo' => 'required|string', // Código do kit
            'name' => 'required|string', // Nome do kit
        ]);

        Log::info('Payload recebido para associar kit:', ['payload' => $request->all()]);
        // Verificar se o Kit existe e está disponível
        $kit = Kit::where('codigo', $request->codigo)->first();
        Log::info('Kit encontrado:', ['kit' => $kit]);

        if (!$kit) {
            return response()->json(['message' => 'Kit não encontrado.'], 404);
        }

        if ($kit->isAssociated) {
            return response()->json(['message' => 'Este kit já está associado.'], 400);
        }

        // Atualizar o kit com os novos valores
        $kit->update([
            'name' => $request->name,
            'isAssociated' => true,
        ]);

        // Associar o kit à planta do utilizador
        PlantsKit::create([
            'user_plant_id' => $userPlantId,
            'kits_id' => $kit->id,
        ]);

        return response()->json(['message' => 'Kit associado com sucesso.']);
    }


    public function exibirInformacoesPlanta($id)
    {
        // Procurar a planta e carregar os kits associados
        $planta = Plant::with('kits')->find($id);

        if (!$planta) {
            return response()->json(['message' => 'Planta não encontrada'], 404);
        }

        // Exibir no console.log os dados da planta e do kit
        $dados = [
            'Planta' => $planta->toArray(),
            'Kits' => $planta->kits->toArray(), // Agora irá pegar os kits associados
        ];

        return response()->json($dados); // Envia como JSON para ser exibido no console do navegador
    }

    public function removeKit($userPlantId)
    {
        // Verifica se a planta do user tem um kit associado
        $plantsKit = PlantsKit::where('user_plant_id', $userPlantId)->first();

        if (!$plantsKit) {
            return response()->json(['message' => 'Nenhum kit associado à planta.'], 404);
        }

        // Obtém o kit associado
        $kit = Kit::find($plantsKit->kits_id);

        // Atualiza o kit para desvinculá-lo
        if ($kit) {
            $kit->update(['isAssociated' => false]);
        }

        // Remove a associação da tabela PlantsKit
        $plantsKit->delete();

        return response()->json(['message' => 'Kit removido com sucesso.']);
    }

    /**
     * Verifica a disponibilidade do código do kit
     * @param string $kitCode Código do kit
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkKitCodeAvailability($kitCode)
    {
        // Verifica se já existe um kit com o código fornecido e se está associado a uma planta
        $kit = Kit::where('codigo', $kitCode)
            ->where('isAssociated', 1) // Verifica se está associado a uma planta
            ->first();

        if ($kit) {
            // Se o kit estiver associado a uma planta, o código não está disponível
            return response()->json(['available' => false, 'message' => 'Kit já está associado a uma planta.'], 200);
        }

        // Se o kit não estiver associado, significa que o código está disponível
        return response()->json(['available' => true, 'message' => 'Código do kit disponível.'], 200);
    }


    /**
     * Atualiza o nome do kit
     * @param string $kitId ID do kit
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateKitName($kitId, Request $request)
    {
        // Valida os dados recebidos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Procura o kit pelo ID
        $kit = Kit::find($kitId);

        if (!$kit) {
            return response()->json(['message' => 'Kit não encontrado.'], 404);
        }

        // Atualiza o nome do kit
        $kit->name = $validated['name'];
        $kit->isAssociated = true;
        $kit->save();

        // Retorna a resposta
        return response()->json(['message' => 'Nome do kit atualizado com sucesso.', 'kit' => $kit], 200);
    }

}
