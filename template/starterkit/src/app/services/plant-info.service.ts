import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Disponível em toda a aplicação
})
export class PlantInfoService {
  private apiUrl = 'http://localhost:8000/api/plants'; // Substitua pelo endpoint correto

  constructor(private http: HttpClient) {}

  // Método para procurar informações de uma planta
  getPlantInfo(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
