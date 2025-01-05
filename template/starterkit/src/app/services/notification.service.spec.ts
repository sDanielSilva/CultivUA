import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification.model';
import { environment } from 'src/environments/environment';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Mocka o sessionStorage para retornar um token
    spyOn(sessionStorage, 'getItem').and.returnValue('fakeAuthToken');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user notifications from the API via GET', () => {
    const dummyNotifications: Notification[] = [
      {
        id: 1,
        message: 'Test Notification 1',
        type: 'info',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        message: 'Test Notification 2',
        type: 'alert',
        is_read: true,
        created_at: new Date().toISOString(),
      },
    ];

    service.getUserNotifications().subscribe((notifications) => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notifications`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fakeAuthToken');
    req.flush(dummyNotifications);
  });

  it('should retrieve admin notifications from the API via GET', () => {
    const dummyNotifications: Notification[] = [
      {
        id: 1,
        message: 'Admin Notification 1',
        type: 'admin-info',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        message: 'Admin Notification 2',
        type: 'admin-alert',
        is_read: true,
        created_at: new Date().toISOString(),
      },
    ];

    service.getAdminNotifications().subscribe((notifications) => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notifications/admin`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fakeAuthToken');
    req.flush(dummyNotifications);
  });

  it('should mark a notification as read via PUT', () => {
    const notificationId = 1;
  
    service.markAsRead(notificationId).subscribe((response) => {
      expect(response).toBeNull(); // Ajusta para verificar null
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/notifications/${notificationId}/mark-read`);
    expect(req.request.method).toBe('PUT');
    req.flush(null); // Simula a resposta como null
  });
});