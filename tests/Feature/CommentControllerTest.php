<?php

use App\Models\User;
use App\Models\BlogPost;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('cria um novo comentário com sucesso', function () {
    // Crie um user e um post para associar ao comentário
    $user = User::factory()->create();
    $post = BlogPost::factory()->create();

    // Dados para criar o comentário
    $data = [
        'comment_text' => 'Este é um comentário de teste.',
        'user_id' => $user->id,
        'post_id' => $post->id,
    ];

    // Faça a requisição para criar o comentário
    $response = $this->postJson('/api/blog-posts/add-comment', $data);

    // Verifica se o status é 201 (Created)
    $response->assertStatus(201)
        ->assertJsonFragment(['comment_text' => 'Este é um comentário de teste.'])
        ->assertJsonFragment(['username' => $user->username]); // Verifica se o nome de user está presente
});

it('retorna os comentários de um post com sucesso', function () {
    // Crie um post e comentários relacionados
    $post = BlogPost::factory()->create();
    $user = User::factory()->create();
    
    $comment1 = Comment::factory()->create([
        'post_id' => $post->id,
        'user_id' => $user->id,
        'comment_text' => 'Comentário 1',
        'isVisible' => 1, // Valor numérico (1 para visível)
    ]);

    $comment2 = Comment::factory()->create([
        'post_id' => $post->id,
        'user_id' => $user->id,
        'comment_text' => 'Comentário 2',
        'isVisible' => 0, // Valor numérico (0 para não visível)
    ]);

    // Fazer a requisição GET para pegar os comentários do post
    $response = $this->getJson("/api/blog-posts/{$post->id}/comments");

    // Verificar se o status é 200 (OK)
    $response->assertStatus(200);

    // Verificar se os comentários estão no formato esperado
    $response->assertJsonFragment(['comment_text' => 'Comentário 1']);
    $response->assertJsonFragment(['comment_text' => 'Comentário 2']);
    $response->assertJsonFragment(['isVisible' => 1]); // Ajustado para 1 (visível)
    $response->assertJsonFragment(['isVisible' => 0]); // Ajustado para 0 (não visível)

    // Verificar se a estrutura dos dados contém os campos esperados
    $response->assertJsonStructure([
        '*' => [
            'comment_id',
            'username',
            'post_id',
            'comment_text',
            'commented_at',
            'isVisible',
        ],
    ]);
});