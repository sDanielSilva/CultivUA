import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SensorService } from './sensor.service';
import { Sensor } from '../models/sensor.model';

describe('SensorService', () => {
  let service: SensorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SensorService],
    });
    service = TestBed.inject(SensorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of sensors', (done: DoneFn) => {
    service.getSensors().subscribe((sensors: Sensor[]) => {
      expect(sensors.length).toBe(2);
      expect(sensors[0].name).toBe('Sensor de Humidade');
      expect(sensors[1].name).toBe('Sensor de Luz');
      done();
    });
  });

  it('should return a sensor by ID', (done: DoneFn) => {
    service.getSensorById('1').subscribe((sensor: Sensor | undefined) => {
      expect(sensor).toBeTruthy();
      expect(sensor?.name).toBe('Sensor de Humidade');
      done();
    });
  });

  it('should return undefined for a non-existent sensor ID', (done: DoneFn) => {
    service.getSensorById('999').subscribe((sensor: Sensor | undefined) => {
      expect(sensor).toBeUndefined();
      done();
    });
  });
});
