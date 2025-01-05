<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * O caminho para as rotas do painel da API.
     *
     * @var string
     */
    public const API_ROUTE = '/api';

    /**
     * O caminho para as rotas da web.
     *
     * @var string
     */
    public const WEB_ROUTE = '/';

    /**
     * Defina qualquer verificação para a aplicação de rotas que seja necessária.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        // Mapeamento das rotas
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }

    /**
     * Defina as rotas da API para a aplicação.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api.php'));
    }

    /**
     * Defina as rotas da Web para a aplicação.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
             ->namespace($this->namespace)
             ->group(base_path('routes/web.php'));
    }
}
