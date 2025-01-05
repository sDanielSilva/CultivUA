import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { InvoiceList } from './invoice';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceinvoiceService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Fetch all invoices
getInvoiceList(): Observable<InvoiceList[]> {
  return this.http.get<InvoiceList[]>(`${this.apiUrl}/products`); // Ensure the correct endpoint, 'products' for fetching products
}

getInvoiceById(id: number): Observable<any> {
    return this.http.get<InvoiceList>(`${this.apiUrl}/products/${id}`);
}

addInvoice(formData: FormData): Observable<any> {
return this.http.post(`${this.apiUrl}/products`, formData);
}

updateInvoice(id: number, formData: FormData): Observable<any> {
  console.log('id', id);

  
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });


  return this.http.put(`${this.apiUrl}/updateProduct/${id}`, formData); // Corrigido
}

deleteInvoice(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
}
getCategories(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/categories`);
}

}

