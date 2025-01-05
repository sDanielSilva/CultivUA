import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ModalEditCategoriaComponent } from './modalEditCategoria.component';
import { ServiceinvoiceService } from '../../../pages/categoriaAdmin/serviceinvoice.service';
import { MaterialModule } from 'material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ModalEditCategoriaComponent', () => {
    let component: ModalEditCategoriaComponent;
    let fixture: ComponentFixture<ModalEditCategoriaComponent>;
    let mockDialogRef: MatDialogRef<ModalEditCategoriaComponent>;
    let mockCategoryService: jasmine.SpyObj<ServiceinvoiceService>;

    const mockCategory = {
        id: 1,
        name: 'Test Category',
        mostrarLoja: true,
        mostrarBlog: false,
        number: 0
    };

    beforeEach(async () => {
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        mockCategoryService = jasmine.createSpyObj('ServiceinvoiceService', ['updateCategory']);

        await TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatDividerModule,
                MatProgressSpinnerModule,
                MatCardModule,
                ModalEditCategoriaComponent,
                BrowserAnimationsModule
            ],
            providers: [
                FormBuilder,
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { category: mockCategory } },
                { provide: ServiceinvoiceService, useValue: mockCategoryService }
            ]
    });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalEditCategoriaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with category data', () => {
        expect(component.editForm.value).toEqual({
            name: mockCategory.name,
            show: mockCategory.mostrarLoja,
            blog: mockCategory.mostrarBlog,
        });
    });

    it('should call updateCategory and close the dialog on successful save', (done) => {
        // Simular resposta bem-sucedida
        mockCategoryService.updateCategory.and.returnValue(of({}));
    
        // Atualizar valores no formulário para simular alteração
        component.editForm.setValue({
            name: 'Updated Category',
            show: true,
            blog: true,
        });
    
        // Chamar o método
        component.saveDetail();
    
        // Esperar a execução do observable
        fixture.whenStable().then(() => {
            // Verificar se a categoria foi atualizada
            expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(mockCategory.id, {
                ...mockCategory,
                name: 'Updated Category',
                mostrarLoja: true,
                mostrarBlog: true,
                number: 0, // Incluído para manter o modelo correto
            });
            
            // Verificar que o diálogo foi fechado com sucesso
            expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    
            // Verificar se isSaving foi alterado para false após a operação
            expect(component.isSaving).toBeFalse(); 
    
            done(); // Indica ao Jasmine que o teste terminou
        });
    });

    it('should handle error on save failure', () => {
        mockCategoryService.updateCategory.and.returnValue(throwError('Error'));
        component.saveDetail();
        expect(component.isSaving).toBeFalse();
        expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should close the dialog on cancel', () => {
        component.onCancel();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
});