<?php

namespace App\Http\Controllers;

use App\Models\Kit; // A importar a classe Kit
use App\Models\KitReading;
use App\Models\Plant;
use App\Models\PlantsKit;
use App\Models\UserPlant;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // A importar a classe Str
use Carbon\Carbon;

class KitController extends Controller
{
    public function getTemperatureData()
    {
        // Procurar os dados da planta, por exemplo, para o Kit com ID 1
        $kitId = 1; // Este valor pode ser dinâmico dependendo do contexto
        $plants = Plant::where('kits_id', $kitId)->get();

        // Obter as leituras de temperatura para o mesmo kit (KitReading)
        $readings = KitReading::where('kits_id', $kitId)
            ->whereBetween('timestmp', [
                Carbon::now()->startOfYear(), // Começo do ano
                Carbon::now()->endOfYear() // Fim do ano
            ])
            ->get();

        // Organize os dados de temperatura para cada mês
        $monthlyTemperatures = [];
        foreach ($readings as $reading) {
            $month = Carbon::parse($reading->timestmp)->format('M');
            if (!isset($monthlyTemperatures[$month])) {
                $monthlyTemperatures[$month] = [];
            }
            $monthlyTemperatures[$month][] = $reading->temperatura;
        }

        // Calcular a temperatura média por mês
        $averageMonthlyTemperatures = [];
        foreach ($monthlyTemperatures as $month => $temperatures) {
            $averageMonthlyTemperatures[$month] = array_sum($temperatures) / count($temperatures);
        }

        // Procurar a temperatura ideal da planta
        $idealTemperatures = [];
        foreach ($plants as $plant) {
            $idealTemperatures[] = $plant->ideal_temperature;
        }

        // Retornar os dados
        return response()->json([
            'averageMonthlyTemperatures' => $averageMonthlyTemperatures,
            'idealTemperatures' => $idealTemperatures,
            'months' => array_keys($monthlyTemperatures),
        ]);
    }

    // Método para criar um novo kit
    public function createKit(Request $request)
    {
        // Criar um novo kit com location_id = 1 e dados genéricos
        $kit = Kit::create([ // Com o modelo Kit
            'codigo' => 'KIT' . strtoupper(Str::random(3)), // Gerando código aleatório para o kit
            'name' => 'Kit Genérico',  // Nome genérico
            'locations_id' => 1,  // Atribuindo location_id = 1
            'isAssociated' => false  // Pode alterar conforme necessidade
        ]);

        // Retornar a resposta com o kit criado
        return response()->json($kit, 201);
    }

    public function checkAvailability($code)
    {
        $kit = Kit::where('codigo', $code)->first();

        if (!$kit) {
            return response()->json(['error' => 'Kit não encontrado.'], 404);
        }

        return response()->json([
            'isAvailable' => !$kit->isAssociated,
        ]);
    }
    // Atualiza o nome do kit

}
