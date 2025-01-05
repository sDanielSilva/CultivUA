import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentificarComponent } from './identificar.component';
import { PlantService } from '../../services/plant.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/shared/toast.service';
import { of, throwError } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('IdentificarComponent', () => {
  let component: IdentificarComponent;
  let fixture: ComponentFixture<IdentificarComponent>;
  let plantService: jasmine.SpyObj<PlantService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const plantServiceSpy = jasmine.createSpyObj('PlantService', ['identifyPlant', 'addPlantToDashboard']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated$', 'setRedirectUrl']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [IdentificarComponent, TablerIconsModule.pick({}), BrowserAnimationsModule],
      providers: [
        { provide: PlantService, useValue: plantServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IdentificarComponent);
    component = fixture.componentInstance;
    plantService = TestBed.inject(PlantService) as jasmine.SpyObj<PlantService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle geolocation', () => {
    spyOn(component, 'getGeolocation');
    component.toggleGeolocation();
    expect(component.sendGeolocation).toBeTrue();
    expect(component.getGeolocation).toHaveBeenCalled();
  });

  it('should get geolocation', () => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success) => {
      success({ coords: { latitude: 10, longitude: 20, accuracy: 0, altitude: null, altitudeAccuracy: null, heading: null, speed: null }, timestamp: Date.now() });
    });
    component.getGeolocation();
    expect(component.userCoordinates).toEqual({ lat: 10, lon: 20 });
  });

  it('should handle geolocation error', () => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((_, error) => {
      if (error) {
        error({
          code: 1,
          message: 'User denied Geolocation',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        } as GeolocationPositionError);
      }
    });
    component.getGeolocation();
    expect(toastService.show).toHaveBeenCalledWith('Permissão de localização negada', 'error', 3000);
  });

  it('should trigger file input', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    document.body.appendChild(fileInput);
    spyOn(fileInput, 'click');
    spyOn(document, 'querySelector').and.returnValue(fileInput);
    component.triggerFileInput();
    expect(fileInput.click).toHaveBeenCalled();
    document.body.removeChild(fileInput);
  });

  it('should handle file change', () => {
    const file = new File([''], 'filename');
    const event = { target: { files: [file] } } as unknown as Event;
    spyOn(component, 'uploadFile');
    component.onFileChange(event);
    expect(component.uploadFile).toHaveBeenCalledWith(file);
  });

  it('should handle file drop', () => {
    const file = new File([''], 'filename');
    const event = { dataTransfer: { files: [file] }, preventDefault: () => {} } as unknown as DragEvent;
    spyOn(component, 'uploadFile');
    component.onDrop(event);
    expect(component.uploadFile).toHaveBeenCalledWith(file);
  });

  it('should handle upload error', () => {
    const file = new File([''], 'filename');
    plantService.identifyPlant.and.returnValue(throwError(() => new Error('error')));
    component.uploadFile(file);
    expect(toastService.show).toHaveBeenCalledWith('Erro no upload', 'error', 3000);
    expect(component.uploadingFile).toBeFalse();
  });

  it('should process plant data', () => {
    const response = {
      plant_id_response: {
        result: {
          classification: {
            suggestions: [{ name: 'Plant', probability: 0.9 }]
          }
        },
        input: { images: ['image'] }
      },
      perenual_response: {
        data: [{ id: 1, common_name: 'Common Plant', cycle: 'Annual', watering: 'Moderate', sunlight: 'Full Sun', description: 'Description' }]
      }
    };
    component.processPlantData(response);
    expect(component.plantData).toEqual({
      name: 'Plant',
      probability: 0.9,
      image: 'image',
      plantId: 1,
      perenualInfo: {
        common_name: 'Common Plant',
        cycle: 'Annual',
        watering: 'Moderate',
        sunlight: 'Full Sun',
        description: 'Description'
      }
    });
  });

  it('should navigate to store', () => {
    component.plantData = { name: 'Plant' };
    component.goToStore();
    expect(router.navigate).toHaveBeenCalledWith(['/loja-online'], { queryParams: { plant: 'Plant' } });
  });
});