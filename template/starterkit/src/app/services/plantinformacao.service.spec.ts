import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlantInformacaoService } from './plantinformacao.service';

describe('PlantInformacaoService', () => {
  let service: PlantInformacaoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlantInformacaoService],
    });
    service = TestBed.inject(PlantInformacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch plant data by ID', () => {
    const dummyPlant = { id: '1', name: 'Rose' };

    service.getPlantById('1').subscribe((plant) => {
      expect(plant).toEqual(dummyPlant);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/plant-informacao/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlant);
  });

  it('should update plant image', () => {
    const dummyResponse = { success: true };
    const userPlantId = '1';
    const base64Image = 'base64string';

    service.updatePlantImage(userPlantId, base64Image).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8000/api/users_plants/${userPlantId}/update-image`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ image: base64Image });
    req.flush(dummyResponse);
  });

  it('should fetch plant data by userPlantId', () => {
    const dummyPlantData = { userPlantId: '1', info: 'Some info' };

    service.getPlantData('1').subscribe((data) => {
      expect(data).toEqual(dummyPlantData);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/planta-info/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlantData);
  });

  it('should fetch plant by userPlantId', () => {
    const dummyPlant = { userPlantId: '1', name: 'Rose' };

    service.getPlantByUserPlantId('1').subscribe((plant) => {
      expect(plant).toEqual(dummyPlant);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/planta-info/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlant);
  });
});
