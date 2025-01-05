import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlantService } from './plant.service';
import { environment } from '../../environments/environment';

describe('PlantService', () => {
  let service: PlantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlantService]
    });
    service = TestBed.inject(PlantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search for plants', () => {
    const dummyPlants = { plants: [{ id: 1, common_name: 'Rose' }] };
    service.searchPlant('Rose').subscribe(plants => {
      expect(plants).toEqual(dummyPlants);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/plants/search`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyPlants);
  });

  it('should add plant to dashboard', () => {
    const dummyResponse = { success: true };
    service.addPlantToDashboard(1, 'Rose').subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user-plants/add`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should identify plant', () => {
    const dummyResponse = { plant: { id: 1, common_name: 'Rose' } };
    const file = new File([''], 'plant.jpg');
    const coordinates = { lat: 10, lon: 20 };

    service.identifyPlant(file, coordinates).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/identify-plant`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should save plant', () => {
    const dummyResponse = { success: true };
    const plantData = { common_name: 'Rose' };

    service.savePlant(plantData, 1).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/plants/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse);
  });
});
