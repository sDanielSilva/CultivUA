<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Listar todos os comentários.
     */
    public function index()
    {
        $comments = Comment::where('isVisible', true)
            ->orderBy('commented_at', 'desc')
            ->get();
        return response()->json($comments, 200);
    }

    /**
     * Criar um novo comentário.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'comment_text' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'post_id' => 'required|exists:blog_posts,id',
        ]);

        // Criar o comentário
        $comment = Comment::create($validated);

        // Carregar os dados do utilizador associado
        $comment->load('user');

        return response()->json([
            'id' => $comment->id,
            'comment_text' => $comment->comment_text,
            'created_at' => $comment->created_at->format('Y-m-d'),
            'user' => [
                'username' => $comment->user->username,
                'profile_image' => $comment->user->imagem ?? null,
            ],
        ], 201);
    }



    /**
     * Atualizar um comentário.
     */
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);


        if (!$comment) {
            return response()->json(['error' => 'Comentário não encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'comment_text' => 'sometimes|string|max:1000',
            'isVisible' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $comment->update($request->only('comment_text', 'isVisible'));

        return response()->json($comment, 200);
    }

    /**
     * Eliminar um comentário.
     */
    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comentário não encontrado'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comentário eliminado com sucesso'], 200);
    }

    public function getComments($postId)
    {
        $comments = Comment::join('users', 'comments.user_id', '=', 'users.id')
            ->where('comments.post_id', $postId)
            ->select(
                'comments.comment_id',
                'users.username',
                'users.imagem',
                'comments.post_id',
                'comments.comment_text',
                'comments.commented_at',
                'comments.isVisible'
            )
            ->get();

        return response()->json($comments);
    }


    public function updateCommentVisibility(Request $request, int $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $comment->isVisible = $request->input('isVisible');
        $comment->save();

        return response()->json(['message' => 'Comment visibility updated'], 200);
    }

}
