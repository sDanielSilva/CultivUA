import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from "src/app/services/core.service";
import { ToastService } from 'src/app/services/shared/toast.service';


@Component({
  selector: 'app-authentication-admin',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './authentication-admin.component.html',
  styleUrl: './authentication-admin.component.scss'
})
export class AuthenticationAdminComponent {
  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  form = new FormGroup({
    Aname: new FormControl("", [
      Validators.required,
    ]),
    password: new FormControl("", [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const adminData = {
        username: this.form.value.Aname,
        password: this.form.value.password,
      };

      this.authService.setRedirectUrl("/dashboardAdmin");

      this.authService.loginAdmin(adminData).subscribe({
        next: (response) => {
          // Logic for successful login
          this.toastService.show('Login successful!', 'success');
          this.authService.redirectAfterLogin();
        },
        error: (error) => {
          // Logic for login error
          this.toastService.show('Invalid admin name or password!', 'warning');
        },
      });
    }
  }
}