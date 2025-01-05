import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KitService {
  private baseUrl = `${environment.apiUrl}/kits`;

  constructor(private http: HttpClient) {}

  getKits(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
