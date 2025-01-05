import { MatDialog } from '@angular/material/dialog';
import { Component } from "@angular/core";
import { CoreService } from "src/app/services/core.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MaterialModule } from "../../../material.module";
import { AuthService } from "src/app/services/auth.service";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from 'src/app/services/shared/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-side-login",
  standalone: true,
  styleUrls: ['./side-login.component.css'],
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: "./side-login.component.html",
})
export class AppSideLoginComponent {
  hidePassword = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private toastService: ToastService
  ) { }

  form = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get f() {
    return this.form.controls;
  }

// Alterna a visibilidade da palavra-passe
togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
}

  submit() {
    if (this.form.valid) {
      const credentials = {
        email: this.form.value.email || '',
        password: this.form.value.password || '',
      };

      this.authService.login(credentials).subscribe(
        (response: any) => {
          this.authService.setToken(response.token);
          this.authService.setAuthenticated(true);
          this.toastService.show('Login successful!', 'success');
          this.authService.redirectAfterLogin();
        },
        (error: any) => {
          const errorMessage = error.status === 401
            ? 'Invalid credentials. Please try again.'
            : 'Internal server error. Please try again later.';

          this.toastService.show(errorMessage, 'error');
        }
      );
    } else {
      this.toastService.show('Please fill in all fields correctly.', 'warning');
    }
  }
}
