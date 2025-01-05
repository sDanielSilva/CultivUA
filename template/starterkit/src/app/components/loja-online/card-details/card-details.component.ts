import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { BlogPostService } from 'src/app/services/blog-post.service';
import { CartService } from 'src/app/services/cart-service.service'; // Importa o CartService
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, MatIconModule, TablerIconsModule, DatePipe, MatButtonModule, CommonModule, MatProgressSpinner],
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {
  loading = true;  // Inicialmente, estamos carregando os dados
  product: any;
  categoryName: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private blogPostService: BlogPostService,
    private cartService: CartService, // Injeta o CartService
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(+productId);
    }
  }

  loadProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product) => {
        this.product = product;
        this.loadCategoryName(product.categories_id); // Chama a função para procurar a categoria
        this.loading = false;  // Finaliza o loading
      },
      (error) => {
        this.toastService.show('Error loading product details!', 'error');
        this.loading = false;  // Finaliza o loading mesmo em caso de erro
      }
    );
  }

  loadCategoryName(categoryId: number): void {
    this.blogPostService.getCategories().subscribe(
      (categories) => {
        const category = categories.find((cat) => cat.id === categoryId);
        this.categoryName = category ? category.name : 'Category not found';
      },
      (error) => {
        this.toastService.show('Error loading categories!', 'error');
      }
    );
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: any): void {
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: this.quantity,
      imagem: product.imagem,
      category_name: this.categoryName,
    };

    // Adiciona o produto ao carrinho utilizando o CartService
    this.cartService.addToCart(formattedProduct);
  }

  downloadPDF(): void {
    // Caminho para o arquivo na pasta assets
    const pdfPath = '../../../../assets/pdf/kit.pdf';
    const link = document.createElement('a');
    link.href = pdfPath; // Define o caminho para o arquivo
    link.download = 'kit.pdf'; // Nome do arquivo ao fazer o download
    link.click();
  }
}
