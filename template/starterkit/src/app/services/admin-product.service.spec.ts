import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceProductAdmin, products } from './admin-product.service';
import { environment } from 'src/environments/environment';

describe('ServiceProductAdmin', () => {
    let service: ServiceProductAdmin;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ServiceProductAdmin]
        });
        service = TestBed.inject(ServiceProductAdmin);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch a product by id', () => {
        const dummyProduct: products = {
            id: 1,
            name: 'Product 1',
            categories_id: '1',
            price: 100,
            stock: 10,
            imagem: 'image.jpg',
            threshold: 5
        };

        service.getProductById(1).subscribe(product => {
            expect(product).toEqual(dummyProduct);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyProduct);
    });

    it('should update a product', () => {
        const dummyProduct: products = {
            id: 1,
            name: 'Updated Product',
            categories_id: '1',
            price: 150,
            stock: 5,
            imagem: 'updated_image.jpg',
            threshold: 3
        };

        service.updateProduct(1, dummyProduct).subscribe(response => {
            expect(response).toEqual(dummyProduct);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/updateProduct/1`);
        expect(req.request.method).toBe('PUT');
        req.flush(dummyProduct);
    });

    it('should fetch categories', () => {
        const dummyCategories = [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' }
        ];

        service.getCategories().subscribe(categories => {
            expect(categories.length).toBe(2);
            expect(categories).toEqual(dummyCategories);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyCategories);
    });

    it('should fetch a product for update by id', () => {
        const dummyProduct: products = {
            id: 1,
            name: 'Product 1',
            categories_id: '1',
            price: 100,
            stock: 10,
            imagem: 'image.jpg',
            threshold: 5
        };

        service.getProduct(1).subscribe(product => {
            expect(product).toEqual(dummyProduct);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/getproductUp/1`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyProduct);
    });
});