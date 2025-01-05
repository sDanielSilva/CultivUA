<?php

use App\Models\Admin;
use App\Models\BlogPost;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('retorna uma lista de posts', function () {
    $category = Category::factory()->create();
    BlogPost::factory(3)->create(['categoria_id' => $category->id]);

    $response = $this->getJson('/api/blog-posts');

    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => [
                'id',
                'title',
                'content',
                'image',
                'featuredPost',
                'categoria_id',
                'category',
                'reading_time',
                'comments_count',
                'created_at',
                'admin' => [
                    'username',
                    'profile_image',
                ],
            ],
        ]);
});

it('retorna detalhes de um post específico', function () {
    $post = BlogPost::factory()->create();

    $response = $this->getJson("/api/blog-posts/{$post->id}");

    $response->assertStatus(200)
        ->assertJsonStructure([
            'id',
            'title',
            'content',
            'image',
            'created_at',
            'read_time',
            'admin' => [
                'username',
                'profile_image',
            ],
            'category',
            'comments_count',
            'comments' => [
                '*' => [
                    'username',
                    'profile_image',
                    'content',
                    'created_at',
                ],
            ],
        ]);
});

it('retorna erro ao procurar post inexistente', function () {
    $response = $this->getJson('/api/blog-posts/999');

    $response->assertStatus(404)
        ->assertJsonFragment(['message' => 'Post não encontrado']);
});


it('retorna erro ao criar post sem autenticação', function () {
    $category = Category::factory()->create();
    $data = [
        'title' => 'Título do Post',
        'content' => 'Conteúdo do Post',
        'status' => 'published',
        'is_highlighted' => true,
        'categoria_id' => $category->id,
    ];

    $response = $this->postJson('/api/blog-posts', $data);

    $response->assertStatus(401)
        ->assertJsonFragment(['error' => 'Não autenticado']);
});


it('retorna erro ao atualizar post inexistente', function () {
    $admin = User::factory()->create();
    Sanctum::actingAs($admin);

    $data = [
        'title' => 'Título Atualizado',
    ];

    $response = $this->putJson('/api/blog-posts/999', $data);

    $response->assertStatus(404)
        ->assertJsonFragment(['message' => 'Post não encontrado']);
});

it('exclui um post existente com sucesso', function () {
    $post = BlogPost::factory()->create();

    $response = $this->deleteJson("/api/blog-posts/{$post->id}");

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Post excluído com sucesso']);

    $this->assertDatabaseMissing('blog_posts', ['id' => $post->id]);
});

it('retorna erro ao excluir post inexistente', function () {
    $response = $this->deleteJson('/api/blog-posts/999');

    $response->assertStatus(404)
        ->assertJsonFragment(['message' => 'Post não encontrado']);
});
