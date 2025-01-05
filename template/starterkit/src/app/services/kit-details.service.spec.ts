import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KitDetailsService } from './kit-details.service';

describe('KitDetailsService', () => {
  let service: KitDetailsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KitDetailsService],
    });
    service = TestBed.inject(KitDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch kit details', () => {
    const dummyKitDetails = { id: 1, name: 'Kit 1', location: 'Location 1' };

    service.getKitDetails(1).subscribe((details) => {
      expect(details).toEqual(dummyKitDetails);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/kit/details/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyKitDetails);
  });

  it('should handle 404 error', () => {
    const errorMessage = 'Kit not found';

    service.getKitDetails(999).subscribe(
      () => fail('expected an error, not kit details'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/kit/details/999');
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
