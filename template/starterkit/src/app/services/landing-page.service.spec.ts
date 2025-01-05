import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LandingPageService, Product } from './landing-page.service';
import { environment } from 'src/environments/environment';

describe('LandingPageService', () => {
    let service: LandingPageService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LandingPageService]
        });
        service = TestBed.inject(LandingPageService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch populares products', () => {
        const dummyProducts: Product[] = [
            { id: 1, name: 'Product 1', price: 10, imagem: 'image1.jpg' },
            { id: 2, name: 'Product 2', price: 20, imagem: 'image2.jpg' }
        ];

        service.getPopulares().subscribe(products => {
            expect(products.length).toBe(2);
            expect(products).toEqual(dummyProducts);
        });

        const req = httpMock.expectOne(`${apiUrl}/populares`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyProducts);
    });

    it('should fetch mais vendidos products', () => {
        const dummyProducts: Product[] = [
            { id: 3, name: 'Product 3', price: 30, imagem: 'image3.jpg' },
            { id: 4, name: 'Product 4', price: 40, imagem: 'image4.jpg' }
        ];

        service.getMaisVendidos().subscribe(products => {
            expect(products.length).toBe(2);
            expect(products).toEqual(dummyProducts);
        });

        const req = httpMock.expectOne(`${apiUrl}/mais-vendidos`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyProducts);
    });

    it('should fetch novidades products', () => {
        const dummyProducts: Product[] = [
            { id: 5, name: 'Product 5', price: 50, imagem: 'image5.jpg' },
            { id: 6, name: 'Product 6', price: 60, imagem: 'image6.jpg' }
        ];

        service.getNovidades().subscribe(products => {
            expect(products.length).toBe(2);
            expect(products).toEqual(dummyProducts);
        });

        const req = httpMock.expectOne(`${apiUrl}/novidades`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyProducts);
    });
});