<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['quantity', 'stock_products_id', 'orders_id'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function stockProduct()
    {
        return $this->belongsTo(StockProduct::class, 'stock_products_id');
    }

}
