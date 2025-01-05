import { Component, Injectable, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TicketUserService } from 'src/app/services/ticket-user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-form-horizontal',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,

  ],
  providers: [provideNativeDateAdapter(), Router],
  templateUrl: './form-horizontal.component.html',
  styleUrl: './form-horizontal.component.scss',
})

@Injectable({
  providedIn: 'root', // Isso torna o serviço disponível globalmente
})
export class AppFormHorizontalComponent implements OnInit {
  contactForm: FormGroup;
  user_id: number | null = null; // Obtemos o ID do AuthService
  email: string = '';
  subject: string = '';
  message: string = '';


  constructor(private fb: FormBuilder, private TicketUserService: TicketUserService, private toastService: ToastService,  private authService: AuthService,  private router: Router, private route: ActivatedRoute, private dialog: MatDialog,) {
    // Inicializa o Reactive Form
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      subject: ['', [Validators.required, Validators.maxLength(255)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Variáveis de controle do estado do formulário
  hide = true;
  hide2 = true;
  conhide = true;
  alignhide = true;

  // Controle de visibilidade do painel (Accordion)
  step = 0;
  panelOpenState = false;

  // Função para controlar o passo do Accordion
  setStep(index: number) {
    this.step = index;
  }

  // Função para avançar para o próximo passo
  nextStep() {
    this.step++;
  }

  // Função para voltar para o passo anterior
  prevStep() {
    this.step--;
  }

 isSubmitting = false; // Adicionar uma variável para controlar o estado do envio

enviarMensagem(event: Event): void {
  event.preventDefault();

  // Bloqueia o envio se já estiver em andamento
  if (this.isSubmitting) return;

  const formValues = this.contactForm.value;

  this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
    if (!isAuthenticated) {
      // Guardar os dados no sessionStorage
      const formData = {
        email: formValues.name,
        subject: formValues.subject,
        message: formValues.message,
      };

      sessionStorage.setItem('formData', JSON.stringify(formData));
      this.authService.setRedirectUrl('/contactos');
      this.toastService.show('You need to be logged in to send a message.', 'warning');
      this.router.navigate(['/login']);
    } else {
      this.isSubmitting = true;

      const payload = {
        user_id: this.user_id ?? 0,
        email: formValues.name,
        subject: formValues.subject,
        message: formValues.message,
      };

      this.TicketUserService.createTicket(payload).subscribe({
        next: (response) => {
            this.toastService.show('Ticket created successfully!', 'success');
          this.contactForm.reset();
          sessionStorage.removeItem('formData'); // Limpar os dados armazenados
          this.isSubmitting = false;
        },
        error: (error) => {
            this.toastService.show('Error creating ticket.', 'error');
          this.isSubmitting = false;
        },
      });
    }
  });
}

ngOnInit(): void {
  // Recuperar dados armazenados no sessionStorage
  const savedFormData = sessionStorage.getItem('formData');
  if (savedFormData) {
    const formData = JSON.parse(savedFormData);
    this.contactForm.patchValue({
      name: formData.email || '',
      subject: formData.subject || '',
      message: formData.message || '',
    });
  }

  // Verificar se o utilizador está autenticado
  this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
    if (isAuthenticated) {
      // Obter o URL de retorno dos parâmetros da rota
      this.route.queryParams.subscribe((params: any) => {
        const redirectUrl = params['returnUrl'] || this.authService.getRedirectUrl();
        if (redirectUrl) {
          this.router.navigate([redirectUrl]).then(() => {
            sessionStorage.removeItem('formData'); // Limpar os dados armazenados
          });
        }
      });
    }
  });
}

verificarLogin(): void {
  this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
    if (!isAuthenticated) {
      // Redireciona para login e guarda a URL atual para retorno
      this.authService.setRedirectUrl('/contactos');
      this.toastService.show('You need to be logged in to continue. Redirecting to the login page.', 'warning');
      this.router.navigate(['/login']);
    } else {
      this.toastService.show('You are already logged in!', 'warning');
    }
  });
}
}
