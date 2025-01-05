<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogPostController extends Controller
{
    /**
     * Lista todos os posts.
     */
    public function index()
    {
        $blogPosts = BlogPost::with(['comments', 'admin', 'category']) // Inclui as relações com comments e admin
            ->orderBy('is_highlighted', 'desc') // Destaques primeiro
            ->orderBy('created_at', 'desc') // Depois pela data de criação
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'image' => $post->image,
                    'featuredPost' => $post->is_highlighted, // Renomeado para corresponder ao Angular
                    'categoria_id' => $post->categoria_id ?? null,
                    'category' => $post->category->name ?? 'Sem Categoria', // Adicionar o ID da categoria
                    'reading_time' => $post->reading_time,  // Tempo de leitura em minutos
                    'comments_count' => $post->comments->where('isVisible', true)->count(),
                    'created_at' => $post->created_at->format('Y-m-d'),
                    'admin' => [
                        'username' => $post->admin->username ?? 'Unknown',
                        'profile_image' => $post->admin->image ?? null,
                    ],
                ];
            });

        return response()->json($blogPosts);
    }



    /**
     * Mostra um post específico.
     */
    public function show($id)
    {
        // Encontrar o post específico com suas relações
        $post = BlogPost::with(['comments.user', 'admin', 'category']) // Incluir a relação com a categoria
            ->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post não encontrado'], 404);
        }

        return response()->json([
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'image' => $post->image,
            'created_at' => $post->created_at->format('Y-m-d'),
            'read_time' => $post->reading_time,
            'admin' => [
                'username' => $post->admin->username ?? 'Unknown',
                'profile_image' => $post->admin->image ?? null,
            ],
            'category' => $post->category->name ?? 'Sem Categoria',  // Aceder ao nome da categoria
            'comments_count' => $post->comments->where('isVisible', true)->count(),
            'comments' => $post->comments->where('isVisible', true)->map(function ($comment) {
                return [
                    'username' => $comment->user->username ?? 'Unknown',
                    'profile_image' => $comment->user->imagem ?? null,
                    'content' => $comment->comment_text,
                    'created_at' => $comment->created_at->format('Y-m-d')
                ];
            })
        ]);
    }



    /**
     * Cria um novo post.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:published,draft',
            'is_highlighted' => 'boolean',
            'categoria_id' => 'required|integer|exists:categories,id',
            'reading_time' => 'nullable|integer|min:0', // Remove esta linha, pois o cálculo será feito no backend
            'image' => 'nullable|string',
        ]);


        $admin = Auth::guard('admin_api')->user();

        if (!$admin) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        // Calcular o tempo de leitura baseado no número de palavras
        $readingTime = ceil(str_word_count(strip_tags($validatedData['content'])) / 200); // 200 palavras por minuto

        // Definir o reading_time calculado
        $validatedData['reading_time'] = $readingTime;

        $validatedData['admins_id'] = $admin->id;

        // Se houver uma imagem, faça o upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blog_images', 'public');
            $validatedData['image'] = $imagePath;
        }

        $post = BlogPost::create($validatedData);

        return response()->json($post, 201);
    }


    /**
     * Atualiza um post existente.
     */
    public function update(Request $request, $id)
    {
        $post = BlogPost::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post não encontrado'], 404);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:published,draft',
            'is_highlighted' => 'boolean',
            'categoria_id' => 'required|integer|exists:categories,id',
            'reading_time' => 'nullable|integer|min:0', // Remova esta linha também
            'image' => 'nullable|string',
        ]);

        $admin = Auth::guard('admin_api')->user();

        if (!$admin) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        // Calcular o tempo de leitura baseado no número de palavras
        $readingTime = ceil(str_word_count(strip_tags($validatedData['content'])) / 200);

        // Definir o reading_time calculado
        $validatedData['reading_time'] = $readingTime;

        $validatedData['admins_id'] = $admin->id;

        // Se houver uma nova imagem, faça o upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blog_images', 'public');
            $validatedData['image'] = $imagePath;
        }

        $post->update($validatedData);

        return response()->json($post);
    }


    /**
     * Remove um post.
     */
    public function destroy($id)
    {
        $post = BlogPost::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post não encontrado'], 404);
        }

        $post->delete();

        return response()->json(['message' => 'Post excluído com sucesso']);
    }
}
