import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppaddplantComponent } from './addplant.component';
import { PlantService } from 'src/app/services/plant.service';
import { ToastService } from 'src/app/services/shared/toast.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';

describe('AppaddplantComponent', () => {
    let component: AppaddplantComponent;
    let fixture: ComponentFixture<AppaddplantComponent>;
    let plantService: jasmine.SpyObj<PlantService>;
    let toastService: jasmine.SpyObj<ToastService>;

    beforeEach(async () => {
        const plantServiceSpy = jasmine.createSpyObj('PlantService', ['searchPlant', 'addPlantToDashboard']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

        await TestBed.configureTestingModule({
            imports: [
                AppaddplantComponent,
                CommonModule,
                MaterialModule,
                TablerIconsModule,
                RouterLink,
                FormsModule,
                TablerIconsModule.pick({}),
            ],
            providers: [
                { provide: PlantService, useValue: plantServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppaddplantComponent);
        component = fixture.componentInstance;
        plantService = TestBed.inject(PlantService) as jasmine.SpyObj<PlantService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should search for plants and update searchResults on success', () => {
        const mockPlants = [{ id: 1, common_name: 'Rose', default_image: { thumbnail: '' } }];
        plantService.searchPlant.and.returnValue(of({ plants: mockPlants }));

        component.plantName = 'Rose';
        component.searchPlant();

        expect(plantService.searchPlant).toHaveBeenCalledWith('Rose');
        expect(component.searchResults).toEqual(mockPlants);
        expect(component.errorMessage).toBe('');
    });

    it('should set errorMessage on searchPlant error', () => {
        const errorResponse = { error: { error: 'Error message' } };
        plantService.searchPlant.and.returnValue(throwError(errorResponse));

        component.plantName = 'Rose';
        component.searchPlant();

        expect(plantService.searchPlant).toHaveBeenCalledWith('Rose');
        expect(component.searchResults).toEqual([]);
        expect(component.errorMessage).toBe('Error message');
    });

    it('should add plant to dashboard and show success toast', () => {
        plantService.addPlantToDashboard.and.returnValue(of({}));

        component.addToDashboard(1, 'Rose');

        expect(plantService.addPlantToDashboard).toHaveBeenCalledWith(1, 'Rose');
        expect(toastService.show).toHaveBeenCalledWith('Planta adicionada com sucesso!', 'success', 3000);
    });
});