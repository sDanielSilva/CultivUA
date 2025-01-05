import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'material.module';
import { ConfirmDialogProductComponent } from './modalDelete.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogProductComponent', () => {
    let component: ConfirmDialogProductComponent;
    let fixture: ComponentFixture<ConfirmDialogProductComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogProductComponent>>;

    beforeEach(async () => {
        // Cria o espião do MatDialogRef
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [
                MaterialModule, 
                NoopAnimationsModule, 
                MatDialogModule,  // Garante de importar o MatDialogModule
                ConfirmDialogProductComponent  // Componente standalone
            ],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },  // Fornece o espião para MatDialogRef
                { provide: MAT_DIALOG_DATA, useValue: {} }  // Fornece os dados para o componente (pode ser um objeto vazio para este teste)
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct title and message', () => {
        const title = fixture.debugElement.query(By.css('h2')).nativeElement;
        const message = fixture.debugElement.query(By.css('mat-dialog-content p')).nativeElement;
        expect(title.textContent).toContain('Confirmar Exclusão');
        expect(message.textContent).toContain('Tens a certeza que queres eliminar este produto?');
    });

    it('should close the dialog with true when onConfirm is called', () => {
        component.onConfirm();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });

    it('should close the dialog with false when onCancel is called', () => {
        component.onCancel();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    it('should call onConfirm when the Excluir button is clicked', () => {
        spyOn(component, 'onConfirm');
        const button = fixture.debugElement.query(By.css('button[color="warn"]')).nativeElement;
        button.click();
        expect(component.onConfirm).toHaveBeenCalled();
    });

    it('should call onCancel when the Cancelar button is clicked', () => {
        spyOn(component, 'onCancel');
        const button = fixture.debugElement.query(By.css('button[mat-button]')).nativeElement;
        button.click();
        expect(component.onCancel).toHaveBeenCalled();
    });
});