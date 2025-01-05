import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppCardsLojaComponent } from '../cards/cards.component';
import { MaterialModule } from 'material.module';
import { CartService, CartItem } from 'src/app/services/cart-service.service';
import { ToastService } from 'src/app/services/shared/toast.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [FormsModule, CommonModule, MaterialModule, AppCardsLojaComponent],
  standalone: true
})
export class ProductsComponent implements OnInit {
  searchQuery = '';
  selectedFilter = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  loading: boolean = true;

  constructor(private productService: ProductService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Carregar os produtos do serviço
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts2().subscribe(
      (products) => {
        this.products = products;
        this.filteredProducts = [...this.products];
        this.categories = this.getCategories(products);  // Extrair categorias
        this.loading = false;
      },
      (error) => {
        this.toastService.show('Error loading products!', 'error');
        this.loading = false;
      }
    );
  }

  // Obter categorias únicas dos produtos
  getCategories(products: any[]): string[] {
    const categorySet = new Set(products.map((product) => product.category_name));
    return Array.from(categorySet);
  }

  // Filtrar por categoria
  filterByCategory(categoryName: string): void {
    this.selectedFilter = categoryName;
    this.applySearchAndFilter(); // Aplicar filtro de categoria e pesquisa juntos
  }

  // Adicionar produto ao carrinho
  addToCart(product: any) {
    console.log('Added to cart:', product);
  }

  // Aplicar pesquisa e filtros
  applySearchAndFilter() {
    const searchLower = this.searchQuery.toLowerCase();
    const filteredByCategory = this.selectedFilter
      ? this.products.filter((product) => product.category_name === this.selectedFilter)
      : this.products;

    this.filteredProducts = filteredByCategory.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchLower);
      return matchesSearch;
    });
  }

  // Limpar filtros
  clearFilters() {
    this.searchQuery = '';
    this.selectedFilter = '';
    this.filteredProducts = [...this.products];
  }
}
