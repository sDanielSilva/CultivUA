import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsersPlantsService {
  private apiUrl = "http://localhost:8000/api/users-plants"; // Substitua com a URL real da sua API

  constructor(private http: HttpClient) { }

  /**
   * Obtém todas as plantas de um user com base no seu ID
   * @param userId ID do user
   * @returns Observable com os dados das plantas
   */
  getUserPlants(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Obtém uma planta específica com base no ID
   * @param plantId ID da planta
   * @returns Observable com os dados da planta
   */
  getPlantById(plantId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${plantId}`);
  }

  /**
   * Obtém todas as localizações associadas às plantas
   * @returns Observable com as localizações
   */
  getLocations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/locations`);
  }

  updateKitName(userPlantId: number, kitData: { name: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userPlantId}/kit/name`, kitData);
  }

  updatePlantKit(userPlantId: number, kitData: { codigo: string; name: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userPlantId}/kit`, kitData);
  }

  dissociateOldKit(kitId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${kitId}/dissociate`, {});
  }

  removeKitById(kitId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${kitId}`);
  }

}
