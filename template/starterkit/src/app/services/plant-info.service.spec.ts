import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlantInfoService } from './plant-info.service';

describe('PlantInfoService', () => {
  let service: PlantInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlantInfoService]
    });
    service = TestBed.inject(PlantInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch plant information', () => {
    const dummyPlants = [
      { id: 1, name: 'Plant 1' },
      { id: 2, name: 'Plant 2' }
    ];

    service.getPlantInfo().subscribe(plants => {
      expect(plants.length).toBe(2);
      expect(plants).toEqual(dummyPlants);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/plants');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlants);
  });

  it('should handle error when fetching plant information', () => {
    const errorMessage = 'Error fetching plant information';
  
    service.getPlantInfo().subscribe(
      () => fail('Expected an error, not plant information'),
      (error) => {
        // Verifica o status do erro
        expect(error.status).toBe(500);
        // Verifica o texto do status do erro
        expect(error.statusText).toBe('Server Error');
        // Verifica a mensagem de erro personalizada
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne('http://localhost:8000/api/plants');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
