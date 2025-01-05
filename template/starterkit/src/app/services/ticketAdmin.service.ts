import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TicketElement {
  id: number;
  title: string;
  subtext: string;
  status: string;
  date: string;
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketAdminService {
    private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getTickets(): Observable<any[]> {
    return this.http.get<TicketElement[]>(`${this.apiUrl}/tickets`);
  }

  updateTicket(id: number, data: any): Observable<any> {
    return this.http.put<TicketElement>(`${this.apiUrl}/updateTicket/${id}`, data);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteTicket/${id}`);
  }
}