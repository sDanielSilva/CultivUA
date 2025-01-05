<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    // Método para retornar todas as locations
    public function index()
    {
        $locations = Location::all();
        return response()->json($locations);
    }

    public function delete($id)
    {
        $location = Location::find($id);

        if ($location) {
            $location->delete();
            return response()->json(['message' => 'Location deleted successfully'], 200);
        }

        return response()->json(['message' => 'Location not found'], 404);
    }

    public function show($id) {
        $location = Location::find($id);
        if ($location) {
            return response()->json($location);
        } else {
            return response()->json(['error' => 'Location not found'], 404);
        }
    }
    
    public function store(Request $request)
    {
        // Valida o campo name
        $request->validate([
            'name' => 'required|string|max:100|unique:locations',
        ]);
    
        // Cria a nova localização
        $location = Location::create([
            'name' => $request->name,
        ]);
    
        // Retorna a resposta com sucesso
        return response()->json($location, 201);
    }
    
        public function update(Request $request, $id)
        {
            // Procura a localização pelo ID
            $location = Location::find($id);
    
            if (!$location) {
                return response()->json(['message' => 'Location not found'], 404);
            }
    
            // Validação dos dados
            $request->validate([
                'name' => 'required|string|max:100',
            ]);
    
            // Atualiza os dados
            $location->name = $request->name;
            $location->save();
    
            return response()->json($location, 200);
        }
    
    
}
