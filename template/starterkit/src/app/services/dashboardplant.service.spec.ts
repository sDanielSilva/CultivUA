import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardPlantService } from './dashboardplant.service';

describe('DashboardPlantService', () => {
  let service: DashboardPlantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardPlantService]
    });
    service = TestBed.inject(DashboardPlantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user plants table', () => {
    const dummyPlants = [{ id: 1, name: 'Plant 1' }, { id: 2, name: 'Plant 2' }];
    service.getUserPlantsTable(1).subscribe(plants => {
      expect(plants.length).toBe(2);
      expect(plants).toEqual(dummyPlants);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/userplants/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlants);
  });

  it('should fetch locations by user plant id', () => {
    const dummyLocations = [{ id: 1, name: 'Location 1' }];
    service.getLocationsByUserId(1).subscribe(locations => {
      expect(locations).toEqual(dummyLocations);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/location/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyLocations);
  });

  it('should fetch all plants', () => {
    const dummyPlants = [{ id: 1, name: 'Plant 1' }];
    service.getPlants().subscribe(plants => {
      expect(plants).toEqual(dummyPlants);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/plants');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlants);
  });

  it('should fetch user plants', () => {
    const dummyUserPlants = [{ id: 1, name: 'User Plant 1' }];
    service.getUserPlants('1').subscribe(userPlants => {
      expect(userPlants).toEqual(dummyUserPlants);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/user-plants/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUserPlants);
  });

  it('should fetch user plants with kits', () => {
    const dummyUserPlantsWithKits = [{ id: 1, name: 'User Plant 1', kits: [] }];
    service.getUserPlantsWithKits('1').subscribe(userPlantsWithKits => {
      expect(userPlantsWithKits).toEqual(dummyUserPlantsWithKits);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/user-plants-kits/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUserPlantsWithKits);
  });

  it('should fetch kit by id', () => {
    const dummyKit = { id: 1, name: 'Kit 1' };
    service.getKitById('1').subscribe(kit => {
      expect(kit).toEqual(dummyKit);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/kits/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyKit);
  });

  it('should fetch all locations', () => {
    const dummyLocations = [{ id: 1, name: 'Location 1' }];
    service.getLocations().subscribe(locations => {
      expect(locations).toEqual(dummyLocations);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/locations');
    expect(req.request.method).toBe('GET');
    req.flush(dummyLocations);
  });

  it('should associate kit to user plant', () => {
    const dummyResponse = { success: true };
    const kitData = { kitId: 1 };
    service.associateKit('1', kitData).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/plants/1/associate-kit');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(kitData);
    req.flush(dummyResponse);
  });

  it('should fetch plant details', () => {
    const dummyPlantDetails = { id: 1, name: 'Plant 1', details: 'Some details' };
    service.getPlantDetails('1').subscribe(plantDetails => {
      expect(plantDetails).toEqual(dummyPlantDetails);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/plants/1/details');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPlantDetails);
  });
});
