<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;  // Para usar a função Hash para passwords
use Illuminate\Validation\Rule;
use App\Models\SupportTicket;

class UserDetailsController extends Controller
{
    /**
     * Obter os detalhes do Utilizador por ID.
     */
    public function getUserDetails($id)
    {
        // Procura o user pelo ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilizador não encontrado'], 404);
        }

        // Retorna os campos incluindo a imagem de perfil e o estado da newsletter
        return response()->json([
            'imagem' => $user->imagem,
            'username' => $user->username,
            'email' => $user->email,
            'newsletter' => $user->newsletter,
        ], 200);
    }

    /**
     * ..Atualizar os detalhes do Utilizador por ID.
     */
    public function updateUserDetails(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilizador não encontrado'], 404);
        }

        $validatedData = $request->validate([
            'username' => 'required|string|min:6|max:255',
            'email' => 'required|email|max:255',
        ]);

        $isUsernameChanged = $validatedData['username'] !== $user->username;
        $isEmailChanged = $validatedData['email'] !== $user->email;

        if ($isUsernameChanged && User::where('username', $validatedData['username'])->where('id', '!=', $id)->exists()) {
            return response()->json(['message' => 'O username já está em uso. Escolha outro username.'], 409);
        }

        if ($isEmailChanged && User::where('email', $validatedData['email'])->where('id', '!=', $id)->exists()) {
            return response()->json(['message' => 'O email já está em uso. Escolha outro email.'], 409);
        }

        $user->username = $validatedData['username'];
        $user->email = $validatedData['email'];
        $user->save();

        return response()->json(['message' => 'Utilizador atualizado com sucesso'], 200);
    }

    /**
     * Atualizar a password do Utilizador por ID.
     */
    public function updatePassword(Request $request, $id)
    {
        // Valida os dados recebidos
        $validatedData = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8',
            'newPassword_confirmation' => 'required|string|same:newPassword',
        ]);

        // Procura o user pelo ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilizador não encontrado'], 404);
        }

        // Verifica se a password atual está correta
        if (!Hash::check($validatedData['currentPassword'], $user->password)) {
            return response()->json(['message' => 'A password atual está incorreta'], 400);
        }

        // Atualiza a password do user
        $user->password = Hash::make($validatedData['newPassword']);
        $user->save();

        return response()->json(['message' => 'Password atualizada com sucesso'], 200);
    }

    public function getUserTickets(Request $request)
    {
        try {
            // Obtém o ID do user autenticado
            $userId = $request->user()->id;

            // Procura os tickets do user
            $tickets = SupportTicket::where('user_id', $userId)
                ->select('subject', 'message', 'created_at', 'status', 'response')
                ->get();

            // Retorna os tickets como JSON
            return response()->json($tickets, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar tickets.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

