import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KitService } from './kit.service';
import { environment } from 'src/environments/environment';

describe('KitService', () => {
  let service: KitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KitService],
    });
    service = TestBed.inject(KitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch kits successfully', () => {
    const dummyKits = [
      { id: 1, name: 'Kit 1' },
      { id: 2, name: 'Kit 2' },
    ];

    service.getKits().subscribe((kits) => {
      expect(kits.length).toBe(2);
      expect(kits).toEqual(dummyKits);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/kits`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyKits);
  });

  it('should handle error when fetching kits', () => {
    const errorMessage = 'Failed to load kits';

    service.getKits().subscribe(
      () => fail('expected an error, not kits'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/kits`);
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});
