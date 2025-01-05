import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, tap } from 'rxjs';
import { InvoiceList } from './invoice';
import { environment } from '../../../environments/environment';


export interface Category {
  id: number;
  name: string;
  mostrarLoja: boolean;
  mostrarBlog: boolean;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceinvoiceService {
  getInvoiceList() {
      throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}`;
  private categoriesCache: Category[] = [];

  constructor(private http: HttpClient) {
  }

  public getLastCategoryId(): number {
    if (this.categoriesCache.length === 0) {
      return 0; // Retorna 0 se não houver categorias no cache
    }
    const lastCategory = this.categoriesCache[this.categoriesCache.length - 1];
    return lastCategory.id; // Retorna o ID da última categoria
  }

  public getCategoryById(id: number): Observable<Category> {
    const cachedCategory = this.categoriesCache.find(category => category.id === id);
    if (cachedCategory) {
      return of(cachedCategory);
    } else {
      return this.http.get<Category>(`${this.apiUrl}/categories/${id}`).pipe(
        tap((data) => {
          this.categoriesCache.push(data);
        })
      );
    }
  }


  public updateCategory(id: number, updatedCategory: Category): Observable<Object> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, updatedCategory);
  }
  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      tap((data) => {
        this.categoriesCache = data;
      })
    );
  }

  public deleteCategory(id: number): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  public addCategory(name: string): Observable<Object> {
    return this.http.post(`${this.apiUrl}/categories/addCategory`, { name });
  }
}


/* public addInvoice(invoice: InvoiceList): void {
  this.invoiceList.splice(0, 0, invoice);
}
public updateInvoice(id: number, invoice: InvoiceList): void {
  const element = this.invoiceList.filter((x) => x.id === id);
  const index: number = this.invoiceList.indexOf(element[0]);
  this.invoiceList[index] = invoice;
} */

/* export class ServiceinvoiceService {
  private apiUrl = 'http://api.exemplo.com/invoices';  // URL da API (exemplo)

  constructor(private http: HttpClient) {}

  // Método para adicionar uma produto
  addInvoice(invoice: InvoiceList): Observable<InvoiceList> {
    // Aqui, você pode guardar a produto em um banco de dados via HTTP
    // ou apenas retornar os dados como exemplo:
    return this.http.post<InvoiceList>(this.apiUrl, invoice);
  }

  // Método para obter a lista de produtos (exemplo)
  getInvoiceList(): Observable<InvoiceList[]> {
    return this.http.get<InvoiceList[]>(this.apiUrl);
  }
}
 */
