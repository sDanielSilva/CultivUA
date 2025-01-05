import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let router: Router;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AuthService,
          {
            provide: Router,
            useValue: {
              navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve()),
            },
          },
        ],
      });
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
      router = TestBed.inject(Router);
    });
  
    afterEach(() => {
      httpMock.verify();
    });
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set token', () => {
    const mockResponse = { token: '12345', id: '1', email: 'test@example.com' };
    const credentials = { email: 'test@example.com', password: 'password' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.getToken()).toBe('12345');
      expect(service.getUserId()).toBe('1');
      expect(sessionStorage.getItem('user_email')).toBe('test@example.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear token', () => {
    service.setToken('12345');
    service.setUserId('1');
    sessionStorage.setItem('user_email', 'test@example.com');

    service.logout().subscribe(() => {
      expect(service.getToken()).toBeNull();
      expect(service.getUserId()).toBeNull();
      expect(sessionStorage.getItem('user_email')).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should register a new user', () => {
    const mockResponse = { success: true };
    const userData = { email: 'newuser@example.com', password: 'password' };

    service.register(userData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get user details', () => {
    const mockResponse = { id: '1', email: 'test@example.com' };

    service.getUserDetails().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should set and get redirect URL', () => {
    service.setRedirectUrl('/dashboard');
    expect(service.getRedirectUrl()).toBe('/dashboard');
  });

  it('should redirect after login', () => {
    
    service.setRedirectUrl('/dashboard');
    service.redirectAfterLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  
   
  });

  it('should get user data', () => {
    service.setUserId('1');
    sessionStorage.setItem('user_email', 'test@example.com');

    service.getUserData().subscribe(data => {
      expect(data).toEqual({ id: '1', email: 'test@example.com' });
    });
  });

  it('should login admin and set token', () => {
    const mockResponse = { token: 'admin12345', id: 'admin1', email: 'admin@example.com', username: 'Admin' }; // Corrigido para "username"
    const credentials = { email: 'admin@example.com', password: 'adminpassword' };
  
    service.loginAdmin(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.getToken()).toBe('admin12345');
      expect(sessionStorage.getItem('admin_id')).toBe('admin1');
      expect(sessionStorage.getItem('admin_email')).toBe('admin@example.com');
      expect(sessionStorage.getItem('admin_name')).toBe('Admin');
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/admin/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout admin and clear token', () => {
    service.setToken('admin12345');
    sessionStorage.setItem('admin_id', 'admin1');
    sessionStorage.setItem('admin_email', 'admin@example.com');
    sessionStorage.setItem('admin_name', 'Admin');

    service.logoutAdmin().subscribe(() => {
      expect(service.getToken()).toBeNull();
      expect(sessionStorage.getItem('admin_id')).toBeNull();
      expect(sessionStorage.getItem('admin_email')).toBeNull();
      expect(sessionStorage.getItem('admin_name')).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/admin/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
