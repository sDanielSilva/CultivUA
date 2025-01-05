<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Preenchimento em massa dos campos
    protected $fillable = ['name', 'mostrarLoja', 'mostrarBlog'];

    // Relacionamento com a tabela 'stock_products'
    public function stockProducts()
    {
        return $this->hasMany(StockProduct::class);
    }
    // A category can have many products
    public function products()  // Method should be plural to match the convention
    {
        return $this->hasMany(Product::class);
    }

    // Caso a tabela 'categories' não use timestamps, você pode adicionar isso
    // public $timestamps = false;
}
