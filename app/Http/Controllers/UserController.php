<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function show()
    {
        return response()->json(Auth::user(), 200);
    }

    public function update(Request $request, User $user)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'username' => 'string|max:255',
            'email' => 'email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
        ]);

        $user->username = $validatedData['username'] ?? $user->username;
        $user->email = $validatedData['email'] ?? $user->email;

        if (!empty($validatedData['password'])) {
            $user->password = bcrypt($validatedData['password']);
        }

        $user->save();

        return response()->json(['message' => 'Perfil atualizado com sucesso', 'user' => $user], 200);
    }

    public function updateNewsletterSubscription(Request $request, User $user)
    {
        // Valida se o estado de 'newsletter' é válido (1 ou 0)
        $validatedData = $request->validate([
            'newsletter' => 'required|boolean',
        ]);

        // Log para verificar se o valor de 'newsletter' foi recebido corretamente
        Log::info("Estado da subscrição recebido: " . $validatedData['newsletter']);

        // Atualiza o estado do campo 'newsletter'
        $user->newsletter = $validatedData['newsletter'];
        $user->save();

        // Log para confirmar que a atualização foi realizada
        Log::info("Subscrição atualizada para: " . $user->newsletter);

        return response()->json(['message' => 'Subscrição atualizada com sucesso!']);
    }

    public function updateProfilePicture(Request $request, User $user)
    {
        // Validação da imagem
        $request->validate([
            'imagem' => 'required|string', // String Base64
        ]);

        $imageBase64 = $request->input('imagem');

        // Verificar se a string Base64 é válida
        if (!preg_match('/^data:image\/(jpeg|png|gif);base64,/', $imageBase64)) {
            return response()->json(['message' => 'Formato de imagem inválido.'], 400);
        }

        Log::info("Imagem recebida: " . $imageBase64);

        // Atualizar apenas o campo 'imagem' no banco de dados
        $user->imagem = $imageBase64;
        $user->save();

        Log::info("Imagem atualizada para o user: " . $user->id . " com a imagem: " . $user->imagem);

        return response()->json(['message' => 'Imagem atualizada com sucesso!'], 200);
    }

}
