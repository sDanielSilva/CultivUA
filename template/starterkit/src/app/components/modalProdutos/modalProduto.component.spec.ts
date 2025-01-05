import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { ProductaddModalComponent } from './modalProduto.component';
import { MaterialModule } from 'material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductaddModalComponent', () => {
    let component: ProductaddModalComponent;
    let fixture: ComponentFixture<ProductaddModalComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProductaddModalComponent>>;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [
                ProductaddModalComponent,
                MaterialModule,
                CommonModule,
                RouterModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
            ],
            providers: [
                UntypedFormBuilder,
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MAT_DIALOG_DATA, useValue: { categories: [] } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductaddModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
        const form = component.productForm;
        expect(form).toBeDefined();
        expect(form.get('name')?.value).toBe('');
        expect(form.get('price')?.value).toBe('');
        expect(form.get('stock')?.value).toBe('');
        expect(form.get('threshold')?.value).toBe('');
        expect(form.get('category')?.value).toBe('');
        expect(form.get('scientific_name')?.value).toBe('');
        expect(form.get('description')?.value).toBe('');
        expect(form.get('size')?.value).toBe('');
        expect(form.get('isKit')?.value).toBe(false);
        expect(form.get('imagem')?.value).toEqual([]);
    });

    it('should add selected file to form', () => {
        const file = new File([''], 'test.png');
        const event = { target: { files: [file] } } as unknown as Event;
        component.onFileSelected(event);
        expect(component.productForm.get('imagem')?.value).toContain(file);
        expect(component.selectedImage).toBe('test.png');
    });

    it('should close the dialog with form data when form is valid', () => {
        component.productForm.setValue({
            name: 'Test Product',
            price: '10',
            stock: '100',
            threshold: '10',
            category: '1',
            scientific_name: 'Testus productus',
            description: 'A test product',
            size: 'Medium',
            isKit: false,
            imagem: [],
        });

        component.saveProduct();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should not close the dialog when form is invalid', () => {
        component.productForm.setValue({
            name: '',
            price: '',
            stock: '',
            threshold: '',
            category: '',
            scientific_name: '',
            description: '',
            size: '',
            isKit: false,
            imagem: [],
        });

        component.saveProduct();
        expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close the dialog without data when close method is called', () => {
        component.close();
        expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
});