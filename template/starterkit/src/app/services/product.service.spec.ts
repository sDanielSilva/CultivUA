import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    const dummyProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];

    service.getAllProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should retrieve a product by id', () => {
    const dummyProduct = { id: 1, name: 'Product 1' };

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProduct);
  });

  it('should create a new product', () => {
    const newProduct = { name: 'New Product' };

    service.createProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update a product', () => {
    const updatedProduct = { id: 1, name: 'Updated Product' };

    service.updateProduct(1, updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve products from /products2', () => {
    const dummyProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];

    service.getProducts2().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${apiUrl}2`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should handle error response', () => {
    const errorMessage = 'Error occurred';
  
    service.getAllProducts().subscribe(
      () => fail('expected an error, not products'),
      (error) => {
        expect(error.status).toBe(500); // Verifica o status do erro
        expect(error.statusText).toBe('Server Error'); // Verifica o texto do status
        expect(error.error).toContain(errorMessage); // Verifica a mensagem de erro
      }
    );
  
    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should handle empty response', () => {
    service.getAllProducts().subscribe(products => {
      expect(products.length).toBe(0);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
