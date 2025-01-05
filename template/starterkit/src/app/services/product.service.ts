import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}
// Obter todos os produtos da rota /products2
getProducts2(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}2`);
}

  // Obter todos os produtos
  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obter um produto específico
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Criar um novo produto
  createProduct(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Atualizar dados de um produto
  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Remover um produto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
