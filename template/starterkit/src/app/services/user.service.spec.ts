import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user details', () => {
    const dummyUser: User = {
      id: '1', 
      email: 'john.doe@example.com',
      newsletter: false,
      username: '',
      password: ''
    };
    authServiceSpy.getToken.and.returnValue('fake-token');

    service.getUserDetails().subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(dummyUser);
  });

  it('should update newsletter subscription', () => {
    sessionStorage.setItem('user_id', '1');
    const isSubscribed = true;

    service.updateNewsletterSubscription(isSubscribed).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1/newsletter`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ newsletter: 1 });
    req.flush({});
  });

  it('should handle error when user_id is not found in sessionStorage', () => {
    sessionStorage.removeItem('user_id');

    service.updateNewsletterSubscription(true).subscribe(
      () => fail('expected an error, not a success'),
      error => expect(error).toBe('Erro: userId não encontrado na sessionStorage')
    );
  });

  it('should get user details header', () => {
    const userId = '1';
    const dummyResponse = { header: 'some-header' };

    service.getUserDetailsHeader(userId).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/userdetails/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
