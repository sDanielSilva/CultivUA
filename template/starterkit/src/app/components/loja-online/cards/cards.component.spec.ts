import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCardsLojaComponent } from './cards.component';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart-service.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'material.module';

describe('AppCardsLojaComponent', () => {
    let component: AppCardsLojaComponent;
    let fixture: ComponentFixture<AppCardsLojaComponent>;
    let productService: jasmine.SpyObj<ProductService>;
    let cartService: jasmine.SpyObj<CartService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts2']);
        const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                MatButtonModule,
                MatCardModule,
                MatChipsModule,
                MatIconModule,
                TablerIconsModule.pick({}),
                MaterialModule,
                AppCardsLojaComponent
            ],
            providers: [
                { provide: ProductService, useValue: productServiceSpy },
                { provide: CartService, useValue: cartServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppCardsLojaComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
        cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load products on init', () => {
        const mockProducts = [
            { id: 1, name: 'Product 1', created_at: new Date(), category_name: 'Category 1', price: 100 },
            { id: 2, name: 'Product 2', created_at: new Date(), category_name: 'Category 2', price: 200 }
        ];
        productService.getProducts2.and.returnValue(of(mockProducts));

        component.ngOnInit();

        expect(productService.getProducts2).toHaveBeenCalled();
        expect(component.products).toEqual(mockProducts);
        expect(component.filteredProducts).toEqual(mockProducts);
        expect(component.categories).toEqual(['Category 1', 'Category 2']);
        expect(component.loading).toBeFalse();
    });

    it('should navigate to product details', () => {
        const productId = 1;
        component.navigateToProductDetails(productId);
        expect(router.navigate).toHaveBeenCalledWith(['/product', productId]);
    });

    it('should add product to cart', () => {
        const mockProduct = { id: 1, name: 'Product 1', price: '100', isKit: 'false', imagem: 'image.jpg', category_name: 'Category 1' };
        const event = new Event('click');
        spyOn(event, 'stopPropagation');

        component.addToCart(mockProduct, event);

        expect(event.stopPropagation).toHaveBeenCalled();
        expect(cartService.addToCart).toHaveBeenCalledWith({
            id: 1,
            name: 'Product 1',
            price: 100,
            quantity: 1,
            isKit: 'false',
            imagem: 'image.jpg',
            category_name: 'Category 1'
        });
    });

    it('should filter products by category', () => {
        component.products = [
            { id: 1, name: 'Product 1', category_name: 'Category 1' },
            { id: 2, name: 'Product 2', category_name: 'Category 2' }
        ];
        component.filterByCategory('Category 1');
        expect(component.filteredProducts).toEqual([{ id: 1, name: 'Product 1', category_name: 'Category 1' }]);
    });

    it('should apply search and filter', () => {
        component.products = [
            { id: 1, name: 'Product 1', category_name: 'Category 1' },
            { id: 2, name: 'Product 2', category_name: 'Category 2' }
        ];
        component.searchQuery = 'Product 1';
        component.applySearchAndFilter();
        expect(component.filteredProducts).toEqual([{ id: 1, name: 'Product 1', category_name: 'Category 1' }]);
    });

    it('should clear filters', () => {
        component.selectedCategories = { 'Category 1': true };
        component.selectedPriceRanges = { '0 - 50€': true };
        component.priceOrder = 'asc';
        component.filteredProducts = [{ id: 1, name: 'Product 1', category_name: 'Category 1' }];

        component.clearFilters();

        expect(component.selectedCategories).toEqual({});
        expect(component.selectedPriceRanges).toEqual({});
        expect(component.priceOrder).toBe('');
        expect(component.filteredProducts).toEqual(component.products);
    });

    it('should apply price sorting', () => {
        component.filteredProducts = [
            { id: 1, name: 'Product 1', price: 200 },
            { id: 2, name: 'Product 2', price: 100 }
        ];

        component.priceOrder = 'asc';
        component.applyPriceSorting();
        expect(component.filteredProducts).toEqual([
            { id: 2, name: 'Product 2', price: 100 },
            { id: 1, name: 'Product 1', price: 200 }
        ]);

        component.priceOrder = 'desc';
        component.applyPriceSorting();
        expect(component.filteredProducts).toEqual([
            { id: 1, name: 'Product 1', price: 200 },
            { id: 2, name: 'Product 2', price: 100 }
        ]);
    });
});