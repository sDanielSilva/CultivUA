import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'material.module';
import { ProductService } from 'src/app/services/product.service';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from 'src/app/services/cart-service.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/shared/toast.service';
@Component({
  selector: 'app-cards',
  imports: [MatCardModule, MatChipsModule, TablerIconsModule, MatButtonModule, MatIconModule, MaterialModule, FormsModule,CommonModule ],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  standalone: true,
})
export class AppCardsLojaComponent implements OnInit {
  searchQuery = '';
  selectedFilter = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  loading = true;
  selectedCategories: { [key: string]: boolean } = {};
  priceOrder: string = '';
  selectedPriceRanges: { [key: string]: boolean } = {};
  
   // Define os intervalos de preços
   priceRanges = [
    { label: '0 - 50€', min: 0, max: 50 },
    { label: '50 - 100€', min: 50, max: 100 },
    { label: '100 - 200€', min: 100, max: 200 },
    { label: '200€+', min: 200, max: Infinity },
  ];

  constructor(private productService: ProductService, private cartService:CartService, private router: Router, private toastService: ToastService) {}

  // Navegar para a página de detalhes
navigateToProductDetails(productId: number): void {
  this.router.navigate(['/product', productId]);
}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts2().subscribe(
      (products) => {
        // Ordena os produtos pela data de criação (do mais recente para o mais antigo)
        this.products = products.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.filteredProducts = [...this.products];
        this.categories = this.getCategories(products);
        this.loading = false;
      },
      (error) => {
        this.toastService.show('Erro ao carregar produtos!', 'error');
        this.loading = false;
      }
    );
  }
  

  getCategories(products: any[]): string[] {
    const categorySet = new Set(products.map((product) => product.category_name));
    return Array.from(categorySet);
  }

  filterByCategory(categoryName: string): void {
    this.selectedFilter = categoryName;
    this.applySearchAndFilter();
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation(); // Evita a propagação do clique para o elemento pai
    const formattedProduct: CartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      isKit: product.isKit,
      imagem: product.imagem,
      category_name: product.category_name,
    };
  
    this.cartService.addToCart(formattedProduct);
    
  }
  

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

  applyCategoryFilter(): void {
    const selectedKeys = Object.keys(this.selectedCategories).filter(
      (key) => this.selectedCategories[key]
    );
  
    // Se tiver filtros selecionados, aplica o filtro
    if (selectedKeys.length > 0) {
      this.filteredProducts = this.products.filter((product) =>
        selectedKeys.includes(product.category_name)
      );
    } else {
      // Se não tiver filtros selecionados, volta todos os produtos
      this.filteredProducts = [...this.products];
    }
  
    // Aplica a ordenação de preços após o filtro de categoria
    this.applyPriceSorting();
  }
  
  clearFilters(): void {
    this.selectedCategories = {};
    this.selectedPriceRanges = {};
    this.priceOrder = '';
    this.filteredProducts = [...this.products];
  }

  // Ordenação de preços
  applyPriceSorting(): void {
    if (this.priceOrder === 'asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.priceOrder === 'desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  // Filtrar por faixa de preço
  applyPriceFilter(): void {
    const selectedRanges = this.priceRanges.filter(
      (range) => this.selectedPriceRanges[range.label]
    );
  
    if (selectedRanges.length > 0) {
      // Filtra os produtos pelas faixas de preço selecionadas
      this.filteredProducts = this.filteredProducts.filter((product) =>
        selectedRanges.some(
          (range) => product.price >= range.min && product.price < range.max
        )
      );
    } else {
      // Se não tiver faixa de preço selecionada, volta todos os produtos
      this.filteredProducts = [...this.products];
    }
  
    // Aplica a ordenação de preços após o filtro de preço
    this.applyPriceSorting();
  }
  
}
