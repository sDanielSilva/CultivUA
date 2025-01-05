import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
  styleUrls: ['./side-register.component.css'],
})
export class AppSideRegisterComponent {
  hidePassword = true;
  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) { }

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  get f() {
    return this.form.controls;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  submit() {
    if (this.form.valid) {
      const userData = {
        username: this.form.value.username,
        email: this.form.value.email,
        password: this.form.value.password,
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.toastService.show('Account created successfully!', 'success', 3000);
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          const errorMessage = err.message || 'Error creating account. Please try again!';
          this.toastService.show(errorMessage, 'error', 3000);
        },
      });
    } else {
      this.toastService.show('Please fill in all fields correctly.', 'error', 3000);
    }
  }
}