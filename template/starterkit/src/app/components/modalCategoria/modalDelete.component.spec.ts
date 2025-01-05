import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'material.module';
import { ConfirmDialogComponent } from './modalDelete.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

    beforeEach(async () => {
        const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [MaterialModule, NoopAnimationsModule, ConfirmDialogComponent, BrowserAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the dialog with true when onConfirm is called', () => {
        component.onConfirm();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });

    it('should close the dialog with false when onCancel is called', () => {
        component.onCancel();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    it('should display the correct title and message', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('h2').textContent).toContain('Confirmar Exclusão');
        expect(compiled.querySelector('p').textContent).toContain('Tens a certeza que queres eliminar esta categoria?');
    });

    it('should have two buttons with correct text', () => {
        const compiled = fixture.nativeElement;
        const buttons = compiled.querySelectorAll('button');
        expect(buttons.length).toBe(2);
        expect(buttons[0].textContent).toContain('Cancelar');
        expect(buttons[1].textContent).toContain('Excluir');
    });
});