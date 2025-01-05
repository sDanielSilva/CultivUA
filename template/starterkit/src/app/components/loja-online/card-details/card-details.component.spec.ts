import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CardDetailsComponent } from './card-details.component';
import { ProductService } from 'src/app/services/product.service';
import { BlogPostService } from 'src/app/services/blog-post.service';
import { CartService } from 'src/app/services/cart-service.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DatePipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

describe('CardDetailsComponent', () => {
    let component: CardDetailsComponent;
    let fixture: ComponentFixture<CardDetailsComponent>;
    let productService: jasmine.SpyObj<ProductService>;
    let blogPostService: jasmine.SpyObj<BlogPostService>;
    let cartService: jasmine.SpyObj<CartService>;

    beforeEach(async () => {
        const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById']);
        const blogPostServiceSpy = jasmine.createSpyObj('BlogPostService', ['getCategories']);
        const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

        await TestBed.configureTestingModule({
            imports: [
                MatTabsModule,
                MatCardModule,
                MatIconModule,
                TablerIconsModule.pick({}),
                DatePipe,
                MatButtonModule,
                CommonModule,
                MatProgressSpinner,
                CardDetailsComponent
            ],
            providers: [
                { provide: ProductService, useValue: productServiceSpy },
                { provide: BlogPostService, useValue: blogPostServiceSpy },
                { provide: CartService, useValue: cartServiceSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => '1' } }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CardDetailsComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
        blogPostService = TestBed.inject(BlogPostService) as jasmine.SpyObj<BlogPostService>;
        cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load product details on init', () => {
        const mockProduct = { id: 1, name: 'Product 1', price: '10.00', categories_id: 1, imagem: 'image.jpg' };
        productService.getProductById.and.returnValue(of(mockProduct));
        const mockCategories = [{ id: 1, name: 'Category 1', mostrarLoja: true, mostrarBlog: true, number: 1 }];
        blogPostService.getCategories.and.returnValue(of(mockCategories));

        component.ngOnInit();

        expect(productService.getProductById).toHaveBeenCalledWith(1);
        expect(blogPostService.getCategories).toHaveBeenCalled();
        expect(component.product).toEqual(mockProduct);
        expect(component.categoryName).toBe('Category 1');
        expect(component.loading).toBeFalse();
    });

    it('should increase quantity', () => {
        component.quantity = 1;
        component.increaseQuantity();
        expect(component.quantity).toBe(2);
    });

    it('should decrease quantity', () => {
        component.quantity = 2;
        component.decreaseQuantity();
        expect(component.quantity).toBe(1);
    });

    it('should not decrease quantity below 1', () => {
        component.quantity = 1;
        component.decreaseQuantity();
        expect(component.quantity).toBe(1);
    });

    it('should add product to cart', () => {
        const mockProduct = { id: 1, name: 'Product 1', price: '10.00', categories_id: 1, imagem: 'image.jpg' };
        component.product = mockProduct;
        component.categoryName = 'Category 1';
        component.quantity = 2;

        component.addToCart(mockProduct);

        expect(cartService.addToCart).toHaveBeenCalledWith({
            id: 1,
            name: 'Product 1',
            price: 10.00,
            quantity: 2,
            imagem: 'image.jpg',
            category_name: 'Category 1'
        });
    });

});