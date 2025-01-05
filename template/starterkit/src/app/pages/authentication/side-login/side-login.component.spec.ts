import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http'; // Importação adicionada
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importação adicionada
import { AppSideLoginComponent } from './side-login.component';
import { CoreService } from 'src/app/services/core.service';

describe('AppSideLoginComponent', () => {
    let component: AppSideLoginComponent;
    let fixture: ComponentFixture<AppSideLoginComponent>;
    let coreServiceStub: Partial<CoreService>;

    beforeEach(async () => {
        coreServiceStub = {
            getOptions: () => ({
                dir: 'ltr',
                theme: 'default',
                sidenavOpened: true,
                sidenavCollapsed: false,
                language: 'en',
                navigation: [],
                notifications: [],
                user: null,
                boxed: false,
                horizontal: false,
                activeTheme: 'default',
                cardBorder: false,
                navPos: 'side'
            })
        };

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                MatDialogModule,
                HttpClientModule, // Adicionado aqui
                AppSideLoginComponent, // Standalone component
                BrowserAnimationsModule, // Adicionado aqui
                AppSideLoginComponent, // Standalone component
            ],
            providers: [{ provide: CoreService, useValue: coreServiceStub }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppSideLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a form with email and password controls', () => {
        expect(component.form.contains('email')).toBeTruthy();
        expect(component.form.contains('password')).toBeTruthy();
      });
    
      it('should make email control required and validate as email', () => {
        const emailControl = component.form.get('email');
        if (emailControl) {
          emailControl.setValue('');
          expect(emailControl.valid).toBeFalsy(); // Required
    
          emailControl.setValue('invalid-email');
          expect(emailControl.valid).toBeFalsy(); // Invalid email
    
          emailControl.setValue('test@example.com');
          expect(emailControl.valid).toBeTruthy(); // Valid email
        }
      });

    it('should make password control required', () => {
        const passwordControl = component.form.get('password');
        if (passwordControl) {
            passwordControl.setValue('');
            expect(passwordControl.valid).toBeFalsy();

            passwordControl.setValue('password');
            expect(passwordControl.valid).toBeTruthy();
        }
    });
});