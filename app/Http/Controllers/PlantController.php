<?php

namespace App\Http\Controllers;
ini_set('memory_limit', '256M');

use App\Models\Plant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\UserPlant;
use App\Models\PlantFaq;

class PlantController extends Controller
{
    public function index()
    {
        // Retornar as plantas do user autenticado
        \Log::info('A iniciar requisição para obter plantas do user autenticado.');
        try {
            $plants = auth()->user()->plants;
            \Log::info('Plantas obtidas com sucesso', ['plants_count' => count($plants)]);
            return response()->json($plants, 200);
        } catch (\Exception $e) {
            \Log::error('Erro ao obter plantas do user', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Erro ao obter plantas.'], 500);
        }
    }

    public function searchPlant(Request $request)
    {
        \Log::info('A iniciar a execução do método searchPlant');
        // Validação dos dados recebidos na requisição
        \Log::info('A iniciar a validação dos dados de pesquisa de planta.', ['request_data' => $request->all()]);

        try {
            $validated = $request->validate(['name' => 'required|string|max:255']);
            \Log::info('Dados validados com sucesso', ['name' => $validated['name']]);

            $plantName = $validated['name'];

            // Verifica se o nome da planta foi recebido corretamente
            \Log::debug('Nome da planta recebido', ['name' => $plantName]);

            $apiKey = env('PERENUAL_API_KEY');
            \Log::info('Chave da API para acesso à Perenual', ['apiKey' => $apiKey]);

            $response = Http::get('https://perenual.com/api/species-list', [
                'key' => $apiKey,
                'q' => $plantName,
            ]);

            \Log::info('Resposta da API recebida', ['status' => $response->status(), 'body' => $response->body()]);

            if ($response->successful()) {
                $data = $response->json()['data'] ?? [];
                \Log::info('Dados da planta retornados pela API', ['plants_count' => count($data)]);
                return response()->json(['plants' => $data], 200);
            } else {
                \Log::error('Erro ao procurar plantas', ['status' => $response->status()]);
                return response()->json(['error' => 'Erro ao procurar plantas.'], $response->status());
            }
        } catch (\Exception $e) {
            \Log::error('Erro ao se comunicar com a API', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Erro ao se comunicar com a API externa.'], 500);
        }
    }

    public function addPlantToDashboard(Request $request)
    {
        \Log::info('A iniciar a adição de planta à dashboard', ['request_data' => $request->all()]);

        try {
            $request->validate([
                'plant_id' => 'required|integer',
                'plant_name' => 'required|string',
            ]);

            $plantId = $request->input('plant_id');
            $plantName = $request->input('plant_name');
            $userId = Auth::id();

            // Verifica se o utilizador está autenticado
            if (!$userId) {
                \Log::warning('user não autenticado');
                return response()->json(['error' => 'user não autenticado'], 401);
            }

            \Log::info('user autenticado', ['user_id' => $userId]);

            // Verifica se a planta já existe na tabela 'plants'
            $plant = Plant::where('name', $plantName)->orWhere('id', $plantId)->first();

            if (!$plant) {
                \Log::info('Planta não encontrada, a consultar a API externa.', ['plant_id' => $plantId]);
                return $this->fetchPlantFromApi($plantId, $userId);
            }

            \Log::info('Planta encontrada ou criada na base de dados', ['plant_id' => $plant->id]);

            // Associa a planta ao utilizador sem verificar duplicidade na tabela 'user_plants'
            UserPlant::create([
                'users_id' => $userId,
                'plants_id' => $plant->id,
            ]);

            $this->fetchAndSaveFaqs($plantName, $plant->id);

            \Log::info('Planta associada com sucesso ao user', ['user_id' => $userId, 'plant_id' => $plant->id]);

            return response()->json([
                'message' => 'Planta adicionada ao utilizador!',
                'user_id' => $userId,
                'plant_id' => $plant->id,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Erro inesperado ao adicionar planta à dashboard', [
                'error_message' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Erro ao adicionar planta.'], 500);
        }
    }

    private function fetchPlantFromApi($plantId, $userId)
    {
        \Log::info('A iniciar execução do fetchPlantFromApi', ['plant_id' => $plantId]);
        \Log::info('A consultar API externa para dados da planta', ['plant_id' => $plantId]);


        $apiKey = env('PERENUAL_API_KEY');
        $apiUrl = "https://perenual.com/api/species/details/{$plantId}?key={$apiKey}";

        \Log::info('API externa consultada', ['api_url' => $apiUrl]);



        try {
            if (isset($apiUrl) && $apiUrl !== null) {
                $response = Http::get($apiUrl);
            } else {
                // Lidar com o erro: URL da API não definida corretamente
                \Log::error('A URL da API externa não está definida corretamente.');
                // Retorne uma resposta de erro apropriada para o user
            }
            \Log::info('Resposta da API', ['status' => $response->status(), 'body' => $response->body()]);

            if ($response->successful()) {
                $data = $response->json();
                \Log::info('Dados da planta recebidos com sucesso da API externa', ['response_data' => $data]);

                $existingPlant = Plant::where('name', $data['common_name'])
                    ->orWhere('species', $data['scientific_name'][0] ?? null)
                    ->first();

                if ($existingPlant) {
                    \Log::info('Planta já existente, a associar ao user', ['plant_id' => $existingPlant->id]);

                    // Associa ao utilizador
                    UserPlant::create([
                        'users_id' => $userId,
                        'plants_id' => $existingPlant->id,
                    ]);

                    return response()->json([
                        'message' => 'Planta já existente associada ao utilizador!',
                        'user_id' => $userId,
                        'plant_id' => $existingPlant->id,
                    ], 200);
                }

                $careGuides = $this->fetchCareGuide($plantId);
                \Log::info('Care Guides antes de guardar', ['guides' => json_encode($careGuides)]);

                // Transformar os campos array em string, se necessário
                if (isset($data['scientific_name']) && is_array($data['scientific_name'])) {
                    $data['scientific_name'] = implode(', ', $data['scientific_name']);
                }

                if (isset($data['origin']) && is_array($data['origin'])) {
                    $data['origin'] = implode(', ', $data['origin']);
                }
                if (isset($data['pruning_month']) && is_array($data['pruning_month'])) {
                    $data['pruning_month'] = implode(', ', $data['pruning_month']);
                }
                if (isset($data['harvest_season']) && is_array($data['harvest_season'])) {
                    $data['harvest_season'] = implode(', ', $data['harvest_season']);
                }

                \Log::info('Dados a serem salvos: ', $data);

                $plant = Plant::create([
                    'image' => $data['default_image']['thumbnail'] ?? null,
                    'name' => $data['common_name'],
                    'species' => $data['scientific_name'] ?? null,
                    'description' => $data['description'] ?? null,
                    'ideal_temperature' => $this->calculateIdealTemperature($data['watering'], $data['sunlight']),
                    'ideal_humidity' => $this->calculateIdealHumidity($data['watering']),
                    'ideal_light' => $this->calculateSunlight($data['sunlight']),
                    'watering_frequency' => $data['watering_general_benchmark']['value'] ?? null,
                    'origin' => $data['origin'] ?? null,
                    'min_dimension' => $data['dimensions']['min_value'] ?? null,
                    'max_dimension' => $data['dimensions']['max_value'] ?? null,
                    'cycle' => $data['cycle'] ?? null,
                    'pruning_months' => $data['pruning_month'] ?? null,
                    'maintenance' => $data['maintenance'] ?? null,
                    'growth_rate' => $data['growth_rate'] ?? null,
                    'indoor' => $data['indoor'] ?? null,
                    'flower' => $data['flowers'] ?? null,
                    'fruit' => $data['fruits'] ?? null,
                    'edible_fruit' => $data['edible_fruit'] ?? null,
                    'edible_leaves' => $data['edible_leaf'] ?? null,
                    'medicinal' => $data['medicinal'] ?? null,
                    'cuisine' => $data['cuisine'] ?? null,
                    'poisonous_to_pets' => $data['poisonous_to_pets'] ?? null,
                    'poisonous_to_humans' => $data['poisonous_to_humans'] ?? null,
                    'harvest_season' => $data['harvest_season'] ?? null,
                    'watering_guide' => $careGuides['watering'] ?? null,
                    'pruning_guide' => $careGuides['pruning'] ?? null,
                    'sunlight_guide' => $careGuides['sunlight'] ?? null,
                ]);



                $scientificName = $data['scientific_name'] ?? '';
                $firstPartOfName = explode(' ', $scientificName)[0];

                $this->fetchAndSaveFaqs($firstPartOfName, $plant->id); // Chama a função com o nome correto

                UserPlant::create([
                    'users_id' => $userId,
                    'plants_id' => $plant->id,
                ]);

                \Log::info('Nova planta criada e associada ao user', ['plant_id' => $plant->id]);

                return response()->json([
                    'message' => 'Nova planta criada e associada ao utilizador!',
                    'user_id' => $userId,
                    'plant_id' => $plant->id,
                ], 201);
            }
            \Log::error('Erro ao consultar a API externa', ['status_code' => $response->status(), 'body' => $response->body()]);
            return response()->json(['error' => 'Falha ao consultar a API externa'], 500);

        } catch (\Exception $e) {
            \Log::error('Erro ao chamar a API externa', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Erro ao chamar a API externa'], 500);
        }
    }


    private function fetchCareGuide($speciesId)
    {
        $apiKey = env('PERENUAL_API_KEY');

        \Log::info('A iniciar consulta de guias de cuidados', ['species_id' => $speciesId]);
        \Log::info('Chave da API para acesso à Perenual', ['apiKey' => $apiKey]);
        \Log::info('A enviar requisição para obter guias de cuidados', ['url' => "https://perenual.com/api/species-care-guide-list?key={$apiKey}&species_id={$speciesId}"]);

        $apiUrl = "https://perenual.com/api/species-care-guide-list?key={$apiKey}&species_id={$speciesId}";

        if (isset($apiUrl) && $apiUrl !== null) {
            $response = Http::get($apiUrl);
        } else {
            // Lidar com o erro: URL da API não definida corretamente
            \Log::error('A URL da API externa não está definida corretamente.');
            // Retorne uma resposta de erro apropriada para o user
        }

        \Log::info('A consultar guias de cuidados', ['species_id' => $speciesId]);

        if ($response->successful()) {
            $data = $response->json();
            $guides = collect($data['data']);

            \Log::info('Guias de cuidados retornados', ['guides' => $guides]);

            // Procurar na seção de cada guia
            $sections = $guides->pluck('section')->flatten(1);

            return [
                'watering' => $sections->firstWhere('type', 'watering')['description'] ?? null,
                'sunlight' => $sections->firstWhere('type', 'sunlight')['description'] ?? null,
                'pruning' => $sections->firstWhere('type', 'pruning')['description'] ?? null,
            ];
        } else {
            \Log::error('Erro ao consultar guias de cuidados', ['status_code' => $response->status(), 'body' => $response->body()]);
            return [
                'watering' => null,
                'sunlight' => null,
                'pruning' => null,
            ];
        }
    }


    private function fetchAndSaveFaqs($plantName, $plantId)
    {
        $apiKey = env('PERENUAL_API_KEY');

        \Log::info('A consultar FAQs para planta', ['plant_name' => $plantName]);

        $apiUrl = "https://perenual.com/api/article-faq-list?key={$apiKey}&q={$plantName}";

        if (isset($apiUrl) && $apiUrl !== null) {
            $response = Http::get($apiUrl);
        } else {
            // Lidar com o erro: URL da API não definida corretamente
            \Log::error('A URL da API externa não está definida corretamente.');
            // Retorne uma resposta de erro apropriada para o user
        }

        \Log::info('A consultar FAQs', ['api_url' => $apiUrl]);

        if ($response->successful()) {
            \Log::info('FAQs retornados com sucesso', ['status_code' => $response->status()]);
            $faqs = $response->json()['data'] ?? [];

            \Log::info('FAQs retornados', ['count' => count($faqs)]);

            foreach ($faqs as $faq) {
                // Guarda cada FAQ a associar ao plantId
                PlantFaq::create([
                    'plant_id' => $plantId,
                    'question' => $faq['question'],
                    'answer' => $faq['answer'],
                ]);
            }
        } else {
            \Log::error('Erro ao consultar FAQs', ['status_code' => $response->status(), 'body' => $response->body()]);
        }
    }



    // Funções auxiliares para calcular os valores

    private function calculateIdealHumidity($watering)
    {
        $humidityMap = [
            'frequent' => 70,
            'average' => 50,
            'minimum' => 30,
            'none' => 10,
        ];

        return $humidityMap[strtolower($watering)] ?? 50; // Retorna 50 como padrão se não encontrar o valor
    }

    private function calculateSunlight($sunlight)
    {
        // Mapeamento dos valores de sunlight para intensidade
        $sunlightMap = [
            'full_shade' => 1,
            'part_shade' => 3,
            'sun-part_shade' => 5,
            'full_sun' => 7,
        ];

        // Verifica se sunlight é uma string ou um array
        if (is_string($sunlight)) {
            $sunlight = [$sunlight];  // Transforma em um array com um único valor
        }

        // Se for um array de valores de sunlight, pega o valor mais forte (máxima intensidade)
        $sunlightIntensity = array_map(function ($item) use ($sunlightMap) {
            return $sunlightMap[strtolower($item)] ?? 3; // Padrão: part_shade = 3
        }, $sunlight);

        return max($sunlightIntensity); // Retorna a maior intensidade de luz
    }

    private function calculateIdealTemperature($watering, $sunlight)
    {
        // Lógica simplificada para calcular a temperatura com base no watering e sunlight
        // Ajuste a temperatura conforme a combinação dos valores de sunlight e watering
        $temperature = 22;  // Valor default

        if ($sunlight == 7 && $watering == 'none') {
            $temperature = 25;
        } elseif ($sunlight == 5 && $watering == 'frequent') {
            $temperature = 20;
        } elseif ($sunlight == 3 && $watering == 'average') {
            $temperature = 18;
        } elseif ($sunlight == 1 && $watering == 'minimum') {
            $temperature = 15;
        }

        return $temperature;
    }

    public function identifyPlant(Request $request)
    {
        try {
            // Validação do arquivo
            $request->validate([
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpg,jpeg,png,gif',
            ]);

            $images = $request->file('images'); // Receber a imagem como array

            \Log::info('Arquivos recebidos:', [
                'count' => count($images),
            ]);

            $apiKey = env('PLANT_ID_API_KEY');
            $perenualApiKey = env('PERENUAL_API_KEY');

            // Lê o conteúdo da imagem e converte para binário
            $fileContent = file_get_contents($images[0]->getRealPath());
            $base64Image = base64_encode($fileContent);

            $mimeType = $images[0]->getMimeType();
            \Log::info('Tipo MIME detectado:', ['mime' => $mimeType]);

            $dataUri = 'data:' . $mimeType . ';base64,' . $base64Image;
            $base64Size = strlen($base64Image);
            \Log::info('Tamanho da base64:', ['size' => $base64Size]);

            if ($base64Size > 5000000) {  // 5MB como exemplo
                \Log::error('Imagem muito grande para ser processada.');
                return response()->json([
                    'error' => 'Imagem muito grande para ser processada.'
                ], 400);
            }

            // Adquirindo as coordenadas, caso estejam presentes
            $latitude = (float) $request->input('latitude', null);
            $longitude = (float) $request->input('longitude', null);

            // Montar os dados para enviar para a API
            $requestData = [
                'images' => [$dataUri],
            ];

            // Se as coordenadas forem fornecidas, adicioná-las ao payload
            if ($latitude && $longitude) {
                $requestData['latitude'] = $latitude;
                $requestData['longitude'] = $longitude;
            }


            // Log do request enviado para a API Plant.id
            \Log::info('Request enviado para a API Plant.id:', [
                'url' => 'https://plant.id/api/v3/identification',
                'data' => $requestData
            ]);

            // Enviar para a API Plant.id
            $response = Http::withHeaders([
                'Api-Key' => $apiKey
            ])
                ->post('https://plant.id/api/v3/identification', $requestData);

            if ($response->successful()) {
                $plantResponse = $response->json();

                // Garantir que result -> classification existe
                $classification = $plantResponse['result']['classification'] ?? null;

                if (!$classification || !isset($classification['suggestions'])) {
                    return response()->json([
                        'error' => 'Dados de classificação não encontrados na resposta.',
                        'response' => $plantResponse,
                    ], 404);
                }

                $suggestions = $classification['suggestions'];

                if (empty($suggestions)) {
                    return response()->json([
                        'error' => 'Nenhuma planta identificada.'
                    ], 404);
                }

                // Extrair o nome científico mais provável
                $scientificName = $suggestions[0]['name'] ?? null;

                if (!$scientificName) {
                    return response()->json([
                        'error' => 'Nome científico não encontrado.'
                    ], 404);
                }

                // Dividir o nome científico para obter apenas o gênero
                $scientificNameParts = explode(' ', $scientificName);
                $firstPartOfName = $scientificNameParts[0]; // Pegando apenas o primeiro nome (gênero)

                $perenualApiUrl = "https://perenual.com/api/species-list?key={$perenualApiKey}&q={$firstPartOfName}";
                \Log::info('A consultar API Perenual', ['url' => $perenualApiUrl]);

                // Consultar a API Perenual com o nome científico (apenas o gênero)
                if (isset($perenualApiUrl) && $perenualApiUrl !== null) {
                    $perenualResponse = Http::get($perenualApiUrl);
                    \Log::info('Resposta da API Perenual', ['status' => $perenualResponse->status(), 'body' => $perenualResponse->body()]);
                } else {
                    // Lidar com o erro: URL da API não definida corretamente
                    \Log::error('A URL da API externa não está definida corretamente.');
                    // Retorne uma resposta de erro apropriada para o user
                }

                if ($perenualResponse->successful()) {
                    return response()->json([
                        'plant_id_response' => $plantResponse,
                        'perenual_response' => $perenualResponse->json(),
                    ], 200);
                }

                \Log::error('Erro na API Perenual', [
                    'status' => $perenualResponse->status(),
                    'response' => $perenualResponse->body(),
                ]);

                return response()->json([
                    'error' => 'Erro ao consultar a API Perenual',
                    'details' => $perenualResponse->json()
                ], 500);
            }

            \Log::error('Erro na API Plant.id', [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return response()->json([
                'error' => 'Erro ao identificar planta',
                'details' => $response->json()
            ], 500);

        } catch (\Exception $e) {
            \Log::error('Erro no servidor: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Erro no servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Plant $plant)
    {
        // Verificar se a planta pertence ao user autenticado
        if ($plant->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($plant, 200);
    }

    public function store(Request $request)
    {
        // Validar os dados recebidos
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string',
        ]);

        // Criar planta associada ao user autenticado
        $plant = auth()->user()->plants()->create($validatedData);

        return response()->json($plant, 201);
    }

    public function update(Request $request, Plant $plant)
    {
        // Verificar se a planta pertence ao user autenticado
        if ($plant->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validar os dados recebidos
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string',
        ]);

        // Atualizar a planta
        $plant->update($validatedData);

        return response()->json($plant, 200);
    }

    public function destroy(Plant $plant)
    {
        // Verificar se a planta pertence ao user autenticado
        if ($plant->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Apagarr a planta
        $plant->delete();

        return response()->json(null, 204);
    }
}
