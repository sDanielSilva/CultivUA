import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Notification } from '../models/notification.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) { }

  getUserNotifications(): Observable<Notification[]> {
    const token = sessionStorage.getItem('auth_token');
    console.log('Fetching user notifications with token:', token);

    return this.http.get<Notification[]>(`${this.apiUrl}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(
      tap(() => console.log('User notifications fetched successfully')),
      catchError((error: any) => {
        console.error('Error fetching user notifications:', error);
        return throwError(error);
      })
    );
  }

  getAdminNotifications(): Observable<Notification[]> {
    const token = sessionStorage.getItem('auth_token');
    console.log('Fetching admin notifications with token:', token);

    return this.http.get<Notification[]>(`${this.apiUrl}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(
      tap(() => console.log('Admin notifications fetched successfully')),
      catchError((error) => {
        console.error('Error fetching admin notifications:', error);
        return throwError(error);
      })
    );
  }


  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/mark-read`, {});
  }
}
