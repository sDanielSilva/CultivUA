import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { environment } from 'src/environments/environment';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch locations', () => {
    const dummyLocations = [{ id: 1, name: 'Location 1' }, { id: 2, name: 'Location 2' }];
    service.getLocations().subscribe(locations => {
      expect(locations.length).toBe(2);
      expect(locations).toEqual(dummyLocations);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/locations`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLocations);
  });

  it('should delete a location', () => {
    const locationId = 1;
    service.deleteLocation(locationId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/locations/${locationId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should fetch a location by id', () => {
    const dummyLocation = { id: 1, name: 'Location 1' };
    service.getLocationById(1).subscribe(location => {
      expect(location).toEqual(dummyLocation);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/locations/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLocation);
  });

  it('should fetch kit readings', () => {
    const dummyReadings = [{ id: 1, value: 'Reading 1' }, { id: 2, value: 'Reading 2' }];
    service.getKitReadings('kit1').subscribe(readings => {
      expect(readings.length).toBe(2);
      expect(readings).toEqual(dummyReadings);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/kit-readings/kit1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyReadings);
  });

  it('should add a location', () => {
    const newLocation = { name: 'New Location' };
    service.addLocation(newLocation).subscribe(location => {
      expect(location).toEqual(newLocation);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/locations`);
    expect(req.request.method).toBe('POST');
    req.flush(newLocation);
  });

  it('should update a location', () => {
    const updatedLocation = { id: 1, name: 'Updated Location' };
    service.updateLocation(1, updatedLocation).subscribe(location => {
      expect(location).toEqual(updatedLocation);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/locations/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedLocation);
  });
});
