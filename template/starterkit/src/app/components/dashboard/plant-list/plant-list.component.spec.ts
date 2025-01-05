import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantListComponent } from './plant-list.component';
import { DashboardPlantService } from '../../../services/dashboardplant.service';
import { AuthService } from '../../../services/auth.service';
import { UsersPlantsService } from '../../../services/users-plants.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from '../../../services/location.service';
import { KitReadingService } from 'src/app/services/kit-reading.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';

describe('PlantListComponent', () => {
  let component: PlantListComponent;
  let fixture: ComponentFixture<PlantListComponent>;
  let mockDashboardPlantService: jasmine.SpyObj<DashboardPlantService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUsersPlantsService: jasmine.SpyObj<UsersPlantsService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockLocationService: jasmine.SpyObj<LocationService>;
  let mockKitReadingService: jasmine.SpyObj<KitReadingService>;

  beforeEach(async () => {
    mockDashboardPlantService = jasmine.createSpyObj('DashboardPlantService', ['getUserPlantsWithKits', 'getUserPlantsTable', 'getLocationsByUserId', 'associateKit', 'updateKitName', 'checkKitCodeAvailability', 'removeKit', 'getPlantDetails']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId']);
    mockUsersPlantsService = jasmine.createSpyObj('UsersPlantsService', ['']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockLocationService = jasmine.createSpyObj('LocationService', ['getLocations']);
    mockKitReadingService = jasmine.createSpyObj('KitReadingService', ['getReadingsByKitId']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        FormsModule,
        MaterialModule,
        RouterModule,
        TablerIconsModule,
        TablerIconsModule.pick({}),
        HttpClientModule
      ],
      providers: [
        { provide: DashboardPlantService, useValue: mockDashboardPlantService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersPlantsService, useValue: mockUsersPlantsService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: LocationService, useValue: mockLocationService },
        { provide: KitReadingService, useValue: mockKitReadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantListComponent);
    component = fixture.componentInstance;

    // Mock the services to return an Observable
    mockAuthService.getUserId.and.returnValue('userId');
    mockLocationService.getLocations.and.returnValue(of([{ id: 1, name: 'Location 1' }]));
    mockDashboardPlantService.getUserPlantsWithKits.and.returnValue(of([{ id: 1, name: 'Plant 1' }]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load locations on init', () => {
     component.ngOnInit();
    
    // Ensure getLocations is called
    expect(mockLocationService.getLocations).toHaveBeenCalled();

    // Ensure the locations are assigned correctly
    expect(component.locations).toEqual([{ id: 1, name: 'Location 1' }]);
  });

  it('should load user plants on init', () => {
    component.ngOnInit();

    // Ensure getUserPlantsWithKits is called with the userId
    expect(mockDashboardPlantService.getUserPlantsWithKits).toHaveBeenCalledWith('userId');

    // Ensure the plants are assigned correctly
    expect(component.plants).toEqual([{ id: 1, name: 'Plant 1' }]);
  });

  it('should filter plants correctly', () => {
    component.plants = [
      { id: 1, name: 'Plant 1', kit_name: 'Kit 1', harvest_season: 'Summer', location: { id: 1 } },
      { id: 2, name: 'Plant 2', kit_name: '', harvest_season: 'Winter', location: { id: 2 } }
    ];
    component.filters = { hasKit: 'true', season: 'Summer', searchTerm: 'Plant 1', locationId: '1' };

    const filteredPlants = component.filteredPlants();

    expect(filteredPlants.length).toBe(1);
    expect(filteredPlants[0].id).toBe(1);
  });

  it('should toggle description visibility', () => {
    component.toggleDescription(1);
    expect(component.showFullDescriptionMap[1]).toBeTrue();

    component.toggleDescription(1);
    expect(component.showFullDescriptionMap[1]).toBeFalse();
  });
});