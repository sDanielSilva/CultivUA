import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarCategoriaCOmponent } from './modalCategoria.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceinvoiceService } from 'src/app/pages/categoriaAdmin/serviceinvoice.service';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AdicionarCategoriaCOmponent', () => {
    let component: AdicionarCategoriaCOmponent;
    let fixture: ComponentFixture<AdicionarCategoriaCOmponent>;
    let mockServiceinvoiceService: jasmine.SpyObj<ServiceinvoiceService>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<AdicionarCategoriaCOmponent>>;

    beforeEach(async () => {
        mockServiceinvoiceService = jasmine.createSpyObj('ServiceinvoiceService', ['getLastCategoryId', 'addCategory']);
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatDialogModule, RouterTestingModule, AdicionarCategoriaCOmponent, BrowserAnimationsModule],
            providers: [
                UntypedFormBuilder,
                { provide: ServiceinvoiceService, useValue: mockServiceinvoiceService },
                { provide: MatDialogRef, useValue: mockDialogRef },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdicionarCategoriaCOmponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
        expect(component.addForm.value).toEqual({ name: '' });
    });

    it('should get the last category ID on init', () => {
        mockServiceinvoiceService.getLastCategoryId.and.returnValue(1);
        component.ngOnInit();
        expect(component.invoice.id).toBe(2);
    });

    it('should save category when form is valid', () => {
        component.addForm.setValue({ name: 'Test Category' });
        mockServiceinvoiceService.addCategory.and.returnValue(of({}));

        component.saveDetail();

        expect(component.isSaving).toBeFalse();
        expect(mockServiceinvoiceService.addCategory).toHaveBeenCalledWith('Test Category');
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should handle error when saving category fails', () => {
        component.addForm.setValue({ name: 'Test Category' });
        mockServiceinvoiceService.addCategory.and.returnValue(throwError('Error'));

        component.saveDetail();

        expect(component.isSaving).toBeFalse();
        expect(mockServiceinvoiceService.addCategory).toHaveBeenCalledWith('Test Category');
    });

    it('should close the dialog on cancel', () => {
        component.onCancel();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});