import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TicketUserService } from 'src/app/services/ticket-user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TicketDetailsComponent } from 'src/app/components/ticket-details/ticket-details.component';
import { MaterialModule } from 'src/app/material.module';
import { alteracoesUserComponent } from './boxAlteracoes/userUpdatesSucesso.component';
import { alteracoesPasswordComponent } from './boxAlteracoes/userPasswordAlterada.component';
import { userErroDadosComponent } from './boxAlteracoes/userErroDados.component';
import { UserService } from 'src/app/services/user.service';
import { PurchaseHistoryComponent } from "../filterable-table/filterable-table.component";
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  templateUrl: './dashboardpu.component.html',
  styleUrls: ['./dashboardpu.component.scss'],
  imports: [
    PurchaseHistoryComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    TablerIconsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MaterialModule,
    alteracoesUserComponent,
    alteracoesPasswordComponent,
    userErroDadosComponent,
    PurchaseHistoryComponent
],
})
export class AppAccountSettingComponent implements OnInit {
  userForm: FormGroup; // Formulário de dados do user
  passwordForm: FormGroup; // Formulário para alteração de password
  isLoadingUserData = false; // Estado de loading para dados do user
  isLoadingPassword = false; // Estado de loading para alteração de password
  currentUsername: string | null = ''; // Armazena o username atual
  currentEmail: string | null = ''; // Armazena o email atual
  tickets: any[] = [];
  displayedColumns: string[] = ['subject', 'message', 'created_at', 'status', 'response'];
  isLoadingTickets: boolean = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  profilePictureUrl: string | ArrayBuffer | null = null; // Pré-visualização da imagem
  selectedImage: File | null = null; // Imagem selecionada pelo utilizador
  isNewsletterSubscribed: boolean = false; // Estado da subscrição da newsletter

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') {
      this.hideCurrentPassword = !this.hideCurrentPassword;
    } else if (field === 'new') {
      this.hideNewPassword = !this.hideNewPassword;
    } else if (field === 'confirm') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }




  constructor(private fb: FormBuilder, private http: HttpClient, private ticketUserService: TicketUserService, private dialog: MatDialog, private toastService: ToastService, @Inject(Router) private router: Router, private userService: UserService) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      newsletter: [false],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadTickets();
  }

  navigateToContactos(): void {
    this.router.navigate(['/contactos'], { fragment: 'end-of-page' });
  }

  openTicketDetails(ticket: any): void {
    this.dialog.open(TicketDetailsComponent, {
      width: '400px',
      data: ticket,
    });
  }


  loadTickets(): void {
    this.isLoadingTickets = true;

    this.ticketUserService.getUserTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoadingTickets = false;
      },
      error: (error) => {
        this.toastService.show("Error loading tickets!", "error");
        this.isLoadingTickets = false;
      },
    });
  }

  loadUserData(): void {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
      this.toastService.show("User not authenticated!", "error");
      return;
    }

    const apiUrl = `http://localhost:8000/api/userdetails/${userId}`;
    this.isLoadingUserData = true;

    this.http
      .get<{
        username: string;
        email: string;
        imagem: string;
        newsletter: number; // Garante de que o tipo está correto
      }>(apiUrl)
      .subscribe(
        (data) => {
          this.userForm.patchValue({
            username: data.username || '',
            email: data.email || '',
            newsletter: !!data.newsletter, // Converte o valor numérico para booleano
          });

          this.currentUsername = data.username || '';
          this.currentEmail = data.email || '';
          this.profilePictureUrl = data.imagem || null;

          this.isNewsletterSubscribed = !!data.newsletter; // Converte para booleano

          this.isLoadingUserData = false;
        },
        (error: any) => {
            this.toastService.show("Unable to load user data. Please try again later.", "error");
          this.isLoadingUserData = false;
        }
      );
  }

  toggleNewsletterSubscription(): void {
    const isSubscribed = this.userForm.get('newsletter')?.value; // Obtém o valor do formControl

    this.userService.updateNewsletterSubscription(isSubscribed).subscribe(
      () => {
        console.log('Newsletter subscription status updated successfully.');
      },
      (error) => {
        this.toastService.show("Unable to update newsletter subscription status. Please try again later.", "error");
      }
    );
  }


  // Método para abrir o explorador de ficheiros
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Método chamado ao selecionar um ficheiro
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Verificar tipo e tamanho da imagem
      if (!file.type.startsWith('image/')) {
        this.toastService.show("Please select a valid image file.", "error");
        return;
      }
      if (file.size > 800 * 1024) {
        this.toastService.show("The file exceeds the maximum allowed size of 800KB.", "warning");
        return;
      }

      this.selectedImage = file;

      // Gerar URL de pré-visualização
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePictureUrl = e.target?.result as string | ArrayBuffer | null;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para guardar a imagem no servidor (opcional para depois)
  saveProfilePicture(): void {
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;

        this.userService.updateProfilePicture(base64String).subscribe({
          next: (response) => {
            this.toastService.show("Image updated successfully", "success");
          },
          error: (err) => {
            this.toastService.show("An error occurred while updating the image!", "error");
          },
        });
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  updateUserDetails(): void {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
      this.toastService.show("User not authenticated", "error");
      return;
    }

    if (this.userForm.invalid) {
      this.toastService.show("Please fill in all fields correctly!", "warning");
      return;
    }

    const updatedUsername = this.userForm.get('username')?.value;
    const updatedEmail = this.userForm.get('email')?.value;

    // Verifica se os valores são iguais aos atuais
    if (updatedUsername === this.currentUsername && updatedEmail === this.currentEmail) {
      this.toastService.show("No changes were made!", "warning");
      return;
    }

    const apiUrl = `http://localhost:8000/api/updateuser/${userId}`;
    const formData = {
      username: updatedUsername,
      email: updatedEmail,
    };

    this.isLoadingUserData = true;

    this.http.put(apiUrl, formData).subscribe(
      () => {
        this.toastService.show("User details updated successfully!", "success");
        this.isLoadingUserData = false;
        this.currentUsername = updatedUsername; // Atualiza os valores atuais
        this.currentEmail = updatedEmail;
      },
      (error) => {
        this.isLoadingUserData = false;
        if (error.status === 409) {
          // Conflict: duplicate username or email
          this.toastService.show('An error occurred!', 'error');
        } else {
          this.toastService.show("Error! Duplicate Username or Email", "error");
        }
      }
    );
  }

  /**
   * Valida se a nova password e a confirmação de password são iguais..
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  /**
   * Atualiza a password do user xibalanque.
   */
  updatePassword(): void {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
      this.toastService.show("User not authenticated!", "error");
      return;
    }

    if (this.passwordForm.invalid) {
      this.toastService.show("Please fill in all fields correctly!", "warning");
      return;
    }

    const apiUrl = `http://localhost:8000/api/update-password/${userId}`;
    const formData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      newPassword_confirmation: this.passwordForm.value.confirmPassword,
    };

    this.isLoadingPassword = true;

    this.http.put(apiUrl, formData).subscribe(
      () => {
        this.toastService.show("Password updated successfully!", "success");
        this.passwordForm.reset();
        this.isLoadingPassword = false;
      },
      (error) => {
        if (error.status === 422) {
          this.toastService.show("Validation error: Check the filled fields.", "error");
        } else if (error.status === 400) {
          this.toastService.show("The current password is incorrect.", "warning");
        } else {
          this.toastService.show("Error updating the password. Please try again.", "error");
        }
        this.isLoadingPassword = false;
      }
    );
  }

  /**
   * Cancela as alterações feitas nos formulários.
   */
  cancelChanges(): void {
    this.userForm.patchValue({
      username: this.currentUsername,
      email: this.currentEmail,
    });
    this.passwordForm.reset();
  }
}
