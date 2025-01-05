import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
  })
  export class AdminDashboardService {

    private apiUrl = `${environment.apiUrl}`;
  
    constructor(private http: HttpClient) {}
  
    getDashboardStats(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/dashboard-stats`);
    }

    getProductsSoldByCategory(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/products-sold-by-category`);
    }

      getMonthlySales(month?: number, year?: number): Observable<{ [key: string]: any[] }> {
        const params: any = {};
        
        if (month) {
          params.month = month.toString();
        }
        
        if (year) {
          params.year = year.toString();
        }
      
        return this.http.get<{ [key: string]: any[] }>(`${this.apiUrl}/monthly-sales`, { params });
      }

      getPlantDataByDay() {
        return this.http.get<any>(`${this.apiUrl}/plant-data-by-day`);
      }
  }