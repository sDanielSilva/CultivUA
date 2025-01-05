import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";


export interface products {
    id: number,
    name: string,
    categories_id: string ,
    price: number,
    stock: number,
    imagem: string,
    threshold: number,
  }

@Injectable({
    providedIn: 'root',
  })
export class ServiceProductAdmin {

    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}

    getProductById(id: number): Observable<any> {
        return this.http.get<products>(`${this.apiUrl}/products/${id}`);
    }

    updateProduct(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/updateProduct/${id}`, data);
    }


    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categories`);
    }

    getProduct(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/getproductUp/${id}`);
      }
}