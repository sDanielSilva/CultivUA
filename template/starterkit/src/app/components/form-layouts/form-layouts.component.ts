import { Component, NgModule, OnInit } from "@angular/core";
import { MaterialModule } from "../../material.module";
import { TablerIconsModule } from "angular-tabler-icons";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    ReactiveFormsModule,

} from "@angular/forms";
import { Router, RouterLinkActive, RouterModule, Routes } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { TicketUserService } from "src/app/services/ticket-user.service";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import {ActivatedRoute} from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { ToastService } from "src/app/services/shared/toast.service";

@Component({
    selector: "app-form-layouts",
    standalone: true,
    imports: [
        MaterialModule,
        TablerIconsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
    ],
    templateUrl: "./form-layouts.component.html",
    styleUrls: ["./form-layouts.component.scss"],
    providers: [provideNativeDateAdapter()],
})
export class AppFormLayoutsComponent implements OnInit {
    ticketForm: FormGroup;
    isSubmitting = false;
    user_id: number | null = null;
    email: string = "";
    isAuthenticated$: Observable<boolean>;
    isAuthenticated: boolean = false;
    fragment: string | null = null;

    constructor(
        private fb: FormBuilder,
        private ticketUserService: TicketUserService,
        private authService: AuthService,
        private router: Router,
        private routeActive: ActivatedRoute,
        private dialog: MatDialog,
        private toastService: ToastService
    ) {
        this.ticketForm = this.fb.group({
            name: ["", [Validators.required, Validators.maxLength(100)]],
            subject: ["", [Validators.required, Validators.maxLength(255)]],
            message: ["", [Validators.required, Validators.minLength(10)]],
        });
    }

    scrollToForm() {
        // Rolando para o formulário, se o fragmento for 'formulario-contato'
        const element = document.getElementById('formulario-contato');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end'});
        }
      }

    ngOnInit(): void {
        // Inicializar a variável isAuthenticated$ com o observável que controla o estado da autenticação
        this.isAuthenticated$ = this.authService.isAuthenticated$;

        // Inscrever-se no observável para atualizar o estado da autenticação
        this.isAuthenticated$.subscribe((isAuthenticated) => {
            this.isAuthenticated = isAuthenticated;
            if (!isAuthenticated) {
                this.toastService.show('User not authenticated!', 'error');
            } else {
                console.log("User authenticated");
            }
        });

        // Restaurar os dados do formulário do Session Storage
        const savedFormData = sessionStorage.getItem("ticketFormData");
        if (savedFormData) {

            const parsedData = JSON.parse(savedFormData);
            this.ticketForm.patchValue(parsedData);

            this.routeActive.fragment.subscribe(fragment => {
                this.fragment = fragment;

                // Aqui você pode fazer algo quando o fragmento for alterado
                if (this.fragment === 'formulario-contato') {
                  this.scrollToForm();
                }
              });
        }

        // Monitorar alterações no formulário e guardar no Session Storage
        this.ticketForm.valueChanges.subscribe((formData) => {
            sessionStorage.setItem("ticketFormData", JSON.stringify(formData));
        });

        // Obter dados do user logado
        this.authService.getUserData().subscribe({
            next: (userData) => {
                if (userData) {
                    this.user_id = userData.id;
                    this.email = userData.email;
                } else {
                    this.toastService.show('User not authenticated!', 'error');
                }
            },
            error: (err) => {
                this.toastService.show('User not authenticated!', 'error');
            },
        });
    }

    private redirectToLogin(): void {
        this.authService.setRedirectUrl(this.router.url);
          // Redireciona após o user clicar em "Ok"
          this.router.navigate(['/login']);
    }

    enviarTicket(event: Event): void {
        event.preventDefault();

        // Bloqueia o envio se já estiver em andamento
        if (this.isSubmitting) {
            return;
        }

        // Verifica se o user está autenticado
        if (!this.isAuthenticated) {
            this.toastService.show('User not authenticated!', 'error');
            this.redirectToLogin();
        } else {
            this.toastService.show('User not authenticated!', 'warning');
            // Se estiver autenticado, cria o ticket
            this.isSubmitting = true;

            // Obtemos os dados do formulário
            const formValues = this.ticketForm.value;
            // Montando o payload com todos os campos necessários
            const payload = {
                user_id: this.user_id ?? 0,
                email: this.email,
                subject: formValues.subject,
                message: formValues.message,
            };
            this.ticketUserService.createTicket(payload).subscribe({
                next: (response) => {
                    this.toastService.show('Ticket created successfully!', 'success');
                    
                    this.ticketForm.reset();
                    sessionStorage.removeItem("ticketFormData"); // Clear saved data
                    this.isSubmitting = false;
                },
                error: (error) => {
                    this.toastService.show('Error creating Ticket!', 'error');
                    this.isSubmitting = false;
                },
            });
        }
    }
}

function ngAfterViewInit() {
    throw new Error("Function not implemented.");
}
