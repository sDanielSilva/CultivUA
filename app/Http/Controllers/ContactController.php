<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use Auth;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Guardar o ticket no banco de dados
        $ticket = SupportTicket::create([
            'user_id' =>  Auth::id(),
            'email' => Auth::user()->email,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]);

        return response()->json(['message' => 'Ticket criado com sucesso!', 'ticket' => $ticket], 201);
    }
}
