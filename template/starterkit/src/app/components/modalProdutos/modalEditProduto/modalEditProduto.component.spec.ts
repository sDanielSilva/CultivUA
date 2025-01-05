import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EditProductModalComponent } from './modalEditProduto.component';
import { ServiceProductAdmin } from '../../../services/admin-product.service';
import { MaterialModule } from 'material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditProductModalComponent', () => {
    let component: EditProductModalComponent;
    let fixture: ComponentFixture<EditProductModalComponent>;
    let mockServiceProductAdmin: jasmine.SpyObj<ServiceProductAdmin>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditProductModalComponent>>;

    beforeEach(async () => {
        mockServiceProductAdmin = jasmine.createSpyObj('ServiceProductAdmin', ['getCategories', 'updateProduct']);
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        mockServiceProductAdmin.getCategories.and.returnValue(of([{ id: 1, name: 'Test Category' }]));
        mockServiceProductAdmin.updateProduct.and.returnValue(of({}));

        await TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                CommonModule,
                RouterModule,
                ReactiveFormsModule,
                HttpClientModule,
                EditProductModalComponent,
                BrowserAnimationsModule,
            ],
            providers: [
                FormBuilder,
                { provide: ServiceProductAdmin, useValue: mockServiceProductAdmin },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { product: { id: 1, name: 'Test Product', categories_id: 'Test Category' } } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProductModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load categories on ngOnInit', () => {
        const categories = [{ id: 1, name: 'Test Category' }];
        mockServiceProductAdmin.getCategories.and.returnValue(of(categories));

        component.ngOnInit();

        expect(component.categories).toEqual(categories);
    });

    it('should save product', () => {
        component.editForm.setValue({
            name: 'Updated Product',
            price: 10,
            threshold: 5,
            stock: 20,
            categories_id: 1,
            scientific_name: 'Scientific Name',
            description: 'Description',
            size: 'Size',
            image: 'data:image/png;base64,',
            isKit: false,
        });

        mockServiceProductAdmin.updateProduct.and.returnValue(of({}));

        component.saveProduct();

        expect(mockServiceProductAdmin.updateProduct).toHaveBeenCalledWith(1, component.editForm.value);
        expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
});