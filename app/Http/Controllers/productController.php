<?php

namespace App\Http\Controllers;

use App\Models\StockProduct;
use App\Models\Category;  // Garante de importar a classe Category
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class productController extends Controller
{
    // Método para listar produtos
    public function index()
    {
        // Retrieve all products with the associated category
        $products = StockProduct::with('category')->get();

        // Map the products to return only the necessary fields
        $products = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock' => $product->stock, 
                'threshold' => $product->threshold,
                'categories_id' => $product->category ? $product->category->name : 'Categoria não definida',
                'scientific_name' => $product->scientific_name, // Nome científico
                'description' => $product->description, // Descrição
                'size' => $product->size, // Tamanho
                'imagem'=> $product->imagem,
                'isKit' => $product->isKit, // Indica se é um Kit
            ];
        });

        return response()->json($products);
    }


    // Método para listar todas as categorias
    public function getCategories()
    {
        // Recupera todas as categorias
        $categories = Category::all();

        // Retorna as categorias como resposta JSON
        return response()->json($categories);
    }

    public function updateProduct(Request $request, $id)
    {
        log::info('request', $request->all());
        $product = StockProduct::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'threshold' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categories_id' => 'required|exists:categories,id',
            'scientific_name' => 'nullable|string', 
            'description' => 'nullable|string',     
            'size' => 'nullable|string',            
            'image' => 'nullable|string', // Base64 da imagem
            'isKit' => 'required|boolean'
        ]);

        if (isset($validatedData['image'])) {
            $validatedData['imagem'] = $validatedData['image'];
            unset($validatedData['image']); // Remover o campo antigo
        }

        $product->update($validatedData);

        return response()->json(['message' => 'Produto atualizado com sucesso!']);
    }


    public function getProductUp($id)
{
    $product = StockProduct::with('category')->find($id);

    if (!$product) {
        return response()->json(['message' => 'Produto não encontrado.'], 404);
    }

    return response()->json($product);
}

    // Método para criar um produto
    public function store(Request $request)
{
    try {
        log::info('request', $request->all());
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categories_id' => 'required|exists:categories,id',
            'threshold' => 'required|integer|min:0',
            'scientific_name' => 'nullable|string', 
            'description' => 'nullable|string',     
            'size' => 'nullable|string',            
            'isKit' => 'required|boolean',         
            'imagem' => 'nullable|array',
            'imagem.*' => 'image|mimes:jpg,jpeg,png',
        ]);

        // Initialize a variable to hold the base64 string
        $base64Image = null;

        // Check if there are any files in the 'imagem' field
        if ($request->hasFile('imagem')) {
            // Get the first image file from the 'imagem' field
            $image = $request->file('imagem')[0];

            // Read the image content into a string
            $fileContent = file_get_contents($image->getRealPath());

            // Encode the file content into base64
            $base64Image = base64_encode($fileContent);

            // Get the MIME type of the image
            $mimeType = $image->getMimeType();

            // Create the Data URI for the image (base64 format)
            $dataUri = 'data:' . $mimeType . ';base64,' . $base64Image;

            // Use only the first image for storage
            $validatedData['imagem'] = $dataUri;
        }

        // Create the product with the validated data
        $product = StockProduct::create($validatedData);

        // Return a success response with the created product
        return response()->json([
            'message' => 'Produto criado com sucesso!',
            'product' => $product,
            'imagem' => $product->imagem, // A imagem será retornada corretamente no formato esperado
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Return validation errors
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        // Catch any other errors
        return response()->json(['error' => 'Erro ao criar produto: ' . $e->getMessage()], 500);
    }
}


    // Método para apagarr um produto
public function destroy($id)
{
    // Encontre o produto pelo ID
    $product = StockProduct::find($id);

    // Verifica se o produto foi encontrado
    if (!$product) {
        return response()->json(['message' => 'Produto não encontrado'], 404);
    }

    // Exclua o produto
    $product->delete();

    // Retorne uma resposta de sucesso
    return response()->json(['message' => 'Produto excluído com sucesso'], 200);
}
// No seu controller, o método para procurar o produto específico:
public function getProductById($id)
    {
        $product = StockProduct::with('category')->find($id);

        if ($product) {
            return response()->json($product);
        } else {
            return response()->json(['error' => 'Produto não encontrado'], 404);
        }
    }



    public function getProducts(Request $request)
    {
        // Com Eloquent com relacionamento
        $products = StockProduct::with('category') // Carrega a relação com 'category'
            ->whereHas('category', function ($query) {
                $query->where('mostrarLoja', 1); // Verifica se 'mostrarLoja' é 1
            })
            ->get();

        // Formata os produtos para a resposta
        $formattedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock' => $product->stock,
                'imagem' => $product->imagem,
                'category_name' => $product->category->name, // Nome da categoria
                'created_at' => $product->created_at,
                'scientific_name' => $product->scientific_name,
                'isKit' => $product->isKit,
                'description' => $product->description,
                'size' => $product->size,
                'stock' => $product->stock,
            ];
        });

        return response()->json($formattedProducts);
    }


    public function getPopulares()
    {
        $products = DB::table('stock_products')
            ->join('order_items', 'stock_products.id', '=', 'order_items.stock_products_id')
            ->select('stock_products.id', 'stock_products.name', 'stock_products.price', 'stock_products.imagem', DB::raw('SUM(order_items.quantity) as total_sales'))
            ->groupBy('stock_products.id', 'stock_products.name', 'stock_products.price', 'stock_products.imagem')
            ->orderByDesc('total_sales')
            ->limit(8)
            ->get();

        return response()->json($products);
    }

    // Produtos mais vendidos nos últimos 30 dias
    public function getMaisVendidos()
    {
        $products = DB::table('stock_products')
            ->join('order_items', 'stock_products.id', '=', 'order_items.stock_products_id')
            ->select('stock_products.id', 'stock_products.name', 'stock_products.price', 'stock_products.imagem', DB::raw('SUM(order_items.quantity) as total_sales'))
            ->where('order_items.created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('stock_products.id', 'stock_products.name', 'stock_products.price', 'stock_products.imagem')
            ->orderByDesc('total_sales')
            ->limit(8)
            ->get();

        return response()->json($products);
    }

    // Produtos mais recentes
    public function getNovidades()
    {
        $products = DB::table('stock_products')
            ->select('id', 'name', 'price', 'imagem', 'created_at')
            ->orderByDesc('created_at')
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}
