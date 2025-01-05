<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\StockProduct;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    /**
     * O nome do modelo correspondente.
     *
     * @var string
     */
    protected $model = OrderItem::class;

    /**
     * Define o estado padrão do modelo.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'quantity' => $this->faker->numberBetween(1, 10), // Quantidade do item
            'stock_products_id' => StockProduct::factory(), // Associar automaticamente a um produto de estoque
            'orders_id' => Order::factory(), // Associar automaticamente a um pedido
        ];
    }
}