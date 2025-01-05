<?php

use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SensorController;
use App\Http\Controllers\SensorReadingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\KitController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\KitReadingController;
use App\Http\Controllers\KitDetailsController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\UserDetailsController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardPlantController;
use App\Http\Controllers\PlantKitController;
use App\Http\Controllers\PlantInformacaoController;
use App\Http\Controllers\WateringController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\PlantFaqController;

Route::put('orders/{orderId}/status', [OrderController::class, 'updateOrderStatus']);


Route::post('create-order', [OrderController::class, 'store']);
Route::post('create-kit', [KitController::class, 'createKit']);

Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);

Route::get('plant-faqs/{plantId}', [PlantFaqController::class, 'getFaqs']);

//Locations
Route::get('/locations/{id}', [LocationController::class, 'show']);
Route::put('/locations/{id}', [LocationController::class, 'update']);
Route::post('/locations', [LocationController::class, 'store']);

//Produtos Loja Online
Route::get('products2', [ProductController::class, 'getProducts']);

//Rega
Route::post('/watering/manual', action: [WateringController::class, 'store']);
Route::get('/plant/{userPlantId}/watering-data', [WateringController::class, 'getWateringData']);

use App\Http\Controllers\UserPlantController;

Route::put('/plants/{id}', [UserPlantController::class, 'updatePlant']);

Route::get('location/{user_plant_id}', [UserPlantController::class, 'getLocationByUserId']);
// routes/api.php
Route::get('userplants/{user_plant_id}', [UserPlantController::class, 'getUserPlantById']);


Route::get('/kit-readings/{kitId}', [KitReadingController::class, 'getReadingsByKitId']);


Route::get('/planta-info', [PlantInformacaoController::class, 'show']); // Para procurar todas as plantas
Route::get('/planta-info/{id}', [PlantInformacaoController::class, 'show']); // Para procurar uma planta específica


// Mostra as informações de uma planta e o kit associado
Route::get('plants/{id}/details', [PlantKitController::class, 'exibirInformacoesPlanta']);
Route::post('/plants/{userPlant}/associate-kit', [PlantKitController::class, 'associateKit']);
// Rota para verificar a disponibilidade do código do kit
Route::get('kits/check-code/{kitCode}', [PlantKitController::class, 'checkKitCodeAvailability']);
// Rota para atualizar o nome do kit
Route::put('kits/{kitId}/update-name', [PlantKitController::class, 'updateKitName']);


// Quiz
Route::get('/quiz', [QuizController::class, 'index']);
Route::post('/quiz/submit', [QuizController::class, 'submit']);

Route::post('/plants/search', [PlantController::class, 'searchPlant']);
Route::post('/user-plants/add', [PlantController::class, 'addPlantToDashboard']);

// Atualizar imagem da planta do user
Route::put('/users_plants/{id}/update-image', [DashboardPlantController::class, 'updatePlantImage']);


Route::get('/plant-informacao/{id}', [DashboardPlantController::class, 'getPlantById']);
// Rota para adicionar um kit a uma planta
Route::post('/plants/{plantId}/add-kit', [DashboardPlantController::class, 'addKitToPlant']);

Route::get('/kits/check-availability/{code}', [KitController::class, 'checkAvailability']);

Route::delete('/plants/{userPlant}/remove-kit', [PlantKitController::class, 'removeKit']);

Route::get('/locations', [DashboardPlantController::class, 'getLocations']);
Route::post('/add-kit-to-plant', [DashboardPlantController::class, 'addKitToPlant']);

Route::get('/user-plants-kits/{userId}', [DashboardPlantController::class, 'getUserPlantsWithKits']);
Route::get('/user-plants/{userId}', [DashboardPlantController::class, 'getUserPlants']);
Route::get('/dashboardplants', [DashboardPlantController::class, 'index']);

// Rotas públicas (sem autenticação)
Route::post('/register', [AuthController::class, 'register']);   // Registo de utilizador
Route::post('login', [AuthController::class, 'login']);          // Login de utilizador

Route::prefix('categories')->group(function () {
    Route::get('/', [AdminOrderController::class, 'index']);
    Route::get('/{id}', [AdminOrderController::class, 'show']);
    Route::put('/{id}', [AdminOrderController::class, 'update']);
    Route::post('/addCategory', [AdminOrderController::class, 'storeCategory']);
    Route::delete('/{id}', [AdminOrderController::class, 'destroy']);
});
Route::get('/dashboard-stats', [AdminOrderController::class, 'getDashboardStats']);
Route::get('/products-sold-by-category', [AdminOrderController::class, 'getProductsSoldByCategory']);
Route::get('/monthly-sales', [AdminOrderController::class, 'getMonthlySales']);
Route::get('/plant-data-by-day', [AdminOrderController::class, 'getPlantDataByDay']);

Route::get('/tickets-user', [UserDetailsController::class, 'getUserTickets']);

Route::get('/tickets', [AdminOrderController::class, 'indexTicket']);
Route::put('/updateTicket/{id}', [AdminOrderController::class, 'updateTicket']);
Route::delete('/deleteTicket/{id}', [AdminOrderController::class, 'destroyTicket']);

//PlantId
Route::post('/identify-plant', [PlantController::class, 'identifyPlant']);
// Rota para procurar todas as locations
Route::get('/locations', [LocationController::class, 'index']);
Route::delete('/locations/{id}', [LocationController::class, 'delete']);

Route::get('/quiz/results', [QuizController::class, 'getResults']);
Route::get('/quiz/questions', function () {
    return response()->json([
        [
            'key' => 'edible',
            'label' => 'Do you want a plant for consumption?',
            'options' => ['Yes', 'No'],
        ],
        [
            'key' => 'indoor',
            'label' => 'Do you want an indoor or outdoor plant?',
            'options' => ['Indoor', 'Outdoor'],
        ],
        [
            'key' => 'watering',
            'label' => 'How often can you water your plants?',
            'options' => ['None', 'Little', 'Medium', 'A lot'],
        ],
        [
            'key' => 'cycle',
            'label' => 'What life cycle do you want for the plants?',
            'options' => ['Perennial', 'Annual', 'Biennial'],
        ],
        [
            'key' => 'sunlight',
            'label' => 'What sunlight exposure can you provide for your plants?',
            'options' => ['Full sun', 'Partial shade', 'Full shade'],
        ],
    ]);
});

Route::get('blog-posts/categories', function () {
    return \App\Models\Category::all();
});


//Blog
Route::prefix('blog-posts')->group(function () {
    Route::get('/', [BlogPostController::class, 'index']);
    Route::get('/{id}', [BlogPostController::class, 'show']);
    Route::post('/', [BlogPostController::class, 'store']);
    Route::put('/{id}', [BlogPostController::class, 'update']);
    Route::delete('/{id}', [BlogPostController::class, 'destroy']);

});

//comentarios blog
Route::get('/blog-posts/{postId}/comments', [CommentController::class, 'getComments']);
Route::put('/blog-posts/comments/{commentId}', [CommentController::class, 'updateCommentVisibility']);
Route::post('/blog-posts/add-comment', [CommentController::class, 'store']);

Route::get('/users/{userId}/purchase-history', [OrderController::class, 'getPurchaseHistory']);

// Rota para obter os detalhes do kit
Route::get('kit/details/{kitId}', [KitDetailsController::class, 'getKitDetails']);


Route::get('/kit/temperature-data', [KitController::class, 'getTemperatureData']);

// perfil utilizador
Route::get('/userdetails/{id}', [UserDetailsController::class, 'getUserDetails']);
Route::put('/updateuser/{id}', [UserDetailsController::class, 'updateUserDetails']);
Route::put('/update-password/{id}', [UserDetailsController::class, 'updatePassword']);

Route::put('/updateProduct/{id}', [ProductController::class, 'updateProduct']);
Route::get('/getproductUp/{id}', [ProductController::class, 'getProductUp']);

Route::get('/populares', [ProductController::class, 'getPopulares']);
Route::get('/mais-vendidos', [ProductController::class, 'getMaisVendidos']);
Route::get('/novidades', [ProductController::class, 'getNovidades']);

//Produtos
Route::prefix('products')->group(function () {
    // Get all products
    Route::get('/', [ProductController::class, 'index']);

    // Store a new product
    Route::post('/', [ProductController::class, 'store']);

    // Update an existing product
    // Route::put('/{id}', [ProductController::class, 'update']);

    // Delete a product
    Route::delete('/{id}', [ProductController::class, 'destroy']);
});
Route::post('/products', [ProductController::class, 'store']);
// Em routes/api.php ou routes/web.php
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
// Em routes/api.php
Route::get('/products/{id}', [ProductController::class, 'getProductById']);
// Em routes/api.php

// Quiz
Route::get('/quiz', [QuizController::class, 'index']);
Route::post('/quiz/submit', [QuizController::class, 'submit']);

Route::middleware(['auth:admin_api'])->group(function () {
    Route::get('/notifications/admin', [NotificationController::class, 'adminIndex']);
});

Route::middleware(['auth:api'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
});
Route::get('/notifications/{userId}', [NotificationController::class, 'getNotifications']);
Route::put('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead']);


Route::put('/users/{user}/newsletter', action: [UserController::class, 'updateNewsletterSubscription']);
Route::put('/users/{user}/profile-picture', action: [UserController::class, 'updateProfilePicture']);

// Rotas protegidas (com autenticação via Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Rota para obter os dados do utilizador autenticado
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    // Logout - destrói o token do utilizador
    Route::post('logout', [AuthController::class, 'logout']);      // Logout de utilizador

    // Rota para obter e atualizar o perfil do utilizador
    Route::get('user/profile', [UserController::class, 'show']);   // Exemplo: Perfil do utilizador
    Route::put('user/profile', [UserController::class, 'update']); // Exemplo: Atualizar perfil do utilizador

    // Rotas de Plantas
    Route::apiResource('plants', PlantController::class);

    // Pedidos
    Route::apiResource('orders', OrderController::class);

    Route::post('/plants/search', [PlantController::class, 'searchPlant']);
    Route::post('/user-plants/add', [PlantController::class, 'addPlantToDashboard']);

    Route::post('/ticket-user', [ContactController::class, 'store']);
});



Route::post('admin/login', [AdminAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('admin/logout', [AdminAuthController::class, 'logout']);

});
