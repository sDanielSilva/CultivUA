import { users } from './../../../../main/src/app/pages/apps/email/user-data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private baseUrl = 'http://localhost:3306';
   //private baseUrl = `${users.apiUrl}/atualizarutilizador`;

  constructor(private http: HttpClient) {}

  // Método para obter os detalhe..s do user
  getUserDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/userdetails`);
  }

  // Método para atualizar os detalhes do user
  updateUserDetails(data: { firstName: string; lastName: string; email: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/atualizarutilizador`, data);
  }
}
