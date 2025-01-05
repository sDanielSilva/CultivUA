import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlantInformacaoService {
  private apiUrl = 'http://localhost:8000/api/plant-informacao'; // Atualize com o seu endpoint base.
  private baseUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}

  // Procurar dados da planta pelo ID
  getPlantById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  updatePlantImage(userPlantId: string | null, base64Image: string) {
    return this.http.put(`http://localhost:8000/api/users_plants/${userPlantId}/update-image`, { image: base64Image });
  }
  
  // Método para obter os dados da planta com base no user_plant_id
  getPlantData(userPlantId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/planta-info/${userPlantId}`);
  }

  // Método para procurar dados da planta pelo user_plant_id
  getPlantByUserPlantId(userPlantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/planta-info/${userPlantId}`);
  }

  
}
