<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class QuizController extends Controller
{   // Submete as respostas do quiz
    public function submit(Request $request)
    {
        // Valida as respostas
        $validated = $request->validate([
            'responses' => 'required|array',
        ]);

        // Log para verificar o conteúdo das respostas recebidas
        \Log::info('Respostas recebidas:', $validated['responses']);  // Verifica o formato das respostas

        // Mapeamento das respostas para a consulta à API
        $mappedResponses = [];

        // Processa as respostas dinâmicas de acordo com a pergunta
        foreach ($validated['responses'] as $question => $answer) {
            \Log::info("Processing question: $question with answer: $answer");  // Log the processing of the question

            // Mapping for the "edible" filter
            if ($question === 'edible') {
            $mappedResponses['edible'] = $answer === 'Yes' ? 1 : 0;
            }
            // Mapping for the "indoor" filter
            elseif ($question === 'indoor') {
            $mappedResponses['indoor'] = $answer === 'Indoor' ? 1 : 0;
            }
            // Mapping for the "watering" filter
            elseif ($question === 'watering') {
            $mappedResponses['watering'] = match ($answer) {
                'None' => 'none',
                'Little' => 'minimal',
                'Medium' => 'average',
                'A lot' => 'frequent',
                default => 'average',
            };
            }
            // Mapping for the "cycle" filter
            elseif ($question === 'cycle') {
            $mappedResponses['cycle'] = match ($answer) {
                'Perennial' => 'perennial',
                'Annual' => 'annual',
                'Biennial' => 'biennial',
                default => 'perennial',
            };
            }
            // Mapping for the "sunlight" filter
            elseif ($question === 'sunlight') {
            $mappedResponses['sunlight'] = match ($answer) {
                'Full sun' => 'full_sun',
                'Partial shade' => 'part_shade',
                'Full shade' => 'full_shade',
                default => 'part_shade',
            };
            }
        }

        // Log para verificar os dados mapeados antes de enviar à API
        \Log::info('Respostas mapeadas para consulta à API:', $mappedResponses);

        $apiKey = env('PERENUAL_API_KEY');
        $apiUrl = "https://perenual.com/api/species-list?key={$apiKey}";

        foreach ($mappedResponses as $key => $value) {
            $apiUrl .= '&' . $key . '=' . urlencode($value);
        }

        \Log::info('API externa consultada', ['api_url' => $apiUrl]);

        if (isset($apiUrl) && $apiUrl !== null) {
            $response = Http::get($apiUrl);
        } else {
            // Lidar com o erro: URL da API não definida corretamente
            \Log::error('A URL da API externa não está definida corretamente.');
            // Retorne uma resposta de erro apropriada para o user
        }

        // Verificar a resposta da API
        if ($response->successful()) {
            $plants = $response->json()['data']; // Obtém os dados das plantas retornados pela API
            \Log::info('Plantas compatíveis encontradas:', $plants);
            return response()->json($plants); // Retorna as plantas como resposta da API
        } else {
            return response()->json(['error' => 'Não foi possível obter as plantas.'], 500);
        }
    }
}
