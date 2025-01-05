import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Product {
  id: number;
  name: string;
  price: number;
  imagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
    private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getPopulares(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/populares`);
  }

  getMaisVendidos(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/mais-vendidos`);
  }

  getNovidades(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/novidades`);
  }
}