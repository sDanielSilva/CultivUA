<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SensorReadingController;
use App\Http\Controllers\SensorController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\AdminPlantController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\QuizController;


/*use Illuminate\Support\Facades\File;

Route::get('/{any}', function () {
    $path = public_path('Spike/index.html'); // Certifica-te de que este caminho está correto.

    if (File::exists($path)) {
        return File::get($path);
    }

    abort(404); // Retorna 404 se o arquivo não existir.
})->where('any', '.*');*/
// Página Inicial
Route::get('/', function () {
    return view('welcome');
});

// Página de Design System (se houver)
Route::get('/designsystem', function () {
    return file_get_contents(public_path('designsystem/index.html'));
});

// **Rotas de Autenticação (com sessões de navegador)**
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

// **Rotas da Dashboard (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::get('/profile/edit', [ProfileController::class, 'edit']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
});

// **Rotas de Plantas (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::resource('plants', PlantController::class);
    Route::get('/plants/{plant}/edit', [PlantController::class, 'edit']);
    Route::post('/plants/{plant}/update', [PlantController::class, 'update']);
    Route::delete('/plants/{plant}', [PlantController::class, 'destroy']);
});

// **Rotas de Sensores (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::resource('sensors', SensorController::class);
    Route::post('/sensors/{sensor}/readings', [SensorReadingController::class, 'store']);
});

// **Rotas de Leituras de Sensores (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::get('/sensors/{sensor}/readings', [SensorReadingController::class, 'index']);
});

// **Rotas de Admin (Apenas para utilizadores autenticados e administradores)**
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index']);
    Route::resource('orders', AdminOrderController::class);
    Route::resource('notifications', AdminNotificationController::class);
});

// **Rotas de Pedidos (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::resource('orders', OrderController::class);
    Route::post('/orders/{order}/complete', [OrderController::class, 'complete']);
});

// **Rotas de Notificações (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
});

// **Rotas de Blog (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::resource('blog', BlogPostController::class);
});

// **Rotas de Quiz (Apenas para utilizadores autenticados)**
Route::middleware(['auth'])->group(function () {
    Route::get('/quiz', [QuizController::class, 'index']);
    Route::post('/quiz/submit', [QuizController::class, 'submit']);
});
