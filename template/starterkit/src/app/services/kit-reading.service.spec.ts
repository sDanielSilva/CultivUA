import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KitReadingService } from './kit-reading.service';

describe('KitReadingService', () => {
  let service: KitReadingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KitReadingService]
    });
    service = TestBed.inject(KitReadingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch readings by kit id', () => {
    const dummyReadings = [
      { id: 1, value: 'Reading 1' },
      { id: 2, value: 'Reading 2' }
    ];

    service.getReadingsByKitId(1).subscribe(readings => {
      expect(readings.length).toBe(2);
      expect(readings).toEqual(dummyReadings);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/kit-readings/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyReadings);
  });

  it('should handle error response', () => {
    const errorMessage = '404 error';

    service.getReadingsByKitId(1).subscribe(
      () => fail('expected an error, not readings'),
      error => expect(error.status).toBe(404)
    );

    const req = httpMock.expectOne('http://localhost:8000/api/kit-readings/1');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
