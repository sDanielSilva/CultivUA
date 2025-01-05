import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersPlantsService } from './users-plants.service';

describe('UsersPlantsService', () => {
  let service: UsersPlantsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersPlantsService]
    });
    service = TestBed.inject(UsersPlantsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user plants by userId', () => {
    const dummyPlants = [{ id: 1, name: 'Plant 1' }, { id: 2, name: 'Plant 2' }];
    const userId = 1;

    service.getUserPlants(userId).subscribe(plants => {
      expect(plants.length).toBe(2);
      expect(plants).toEqual(dummyPlants);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlants);
  });

  it('should fetch plant by plantId', () => {
    const dummyPlant = { id: 1, name: 'Plant 1' };
    const plantId = 1;

    service.getPlantById(plantId).subscribe(plant => {
      expect(plant).toEqual(dummyPlant);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${plantId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlant);
  });

  it('should fetch locations', () => {
    const dummyLocations = [{ id: 1, name: 'Location 1' }, { id: 2, name: 'Location 2' }];

    service.getLocations().subscribe(locations => {
      expect(locations.length).toBe(2);
      expect(locations).toEqual(dummyLocations);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/locations`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLocations);
  });
});
