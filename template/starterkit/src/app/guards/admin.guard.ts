import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const userType = sessionStorage.getItem('user_type');

    if (token && userType === 'admin') {
      return true;
    }

    this.router.navigate(['/loginAdministrador']);
    return false;
  }
}
