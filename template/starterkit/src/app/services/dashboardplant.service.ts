import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DashboardPlantService {
    private apiUrl = "http://localhost:8000/api/"; // URL do Laravel

    constructor(private http: HttpClient) { }
    // Método para procurar plantas do user
    getUserPlantsTable(userId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}userplants/${userId}`);
    }

    getLocationsByUserId(userPlantId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}location/${userPlantId}`);
    }

    /**
     * Retorna todas as plantas
     */
    getPlants(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}plants`);
    }

    /**
     * Retorna as plantas de um user específico
     * @param userId ID do user
     */
    getUserPlants(userId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}user-plants/${userId}`);
    }

    /**
     * Retorna as plantas do user com os kits associados
     * @param userId ID do user
     */
    getUserPlantsWithKits(userId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}user-plants-kits/${userId}`);
    }

    /**
     * Procura um kit pelo ID
     * @param kitId ID do kit
     */
    getKitById(kitId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}kits/${kitId}`);
    }

    /**
   * Atualiza o kit e associa à planta
   * @param data Dados para associar o kit à planta
  /**
   * Retorna todas as localizações disponíveis
   */
    getLocations(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}locations`);
    }

    associateKit(userPlantId: string, kitData: any) {
        return this.http.post(
            `${this.apiUrl}plants/${userPlantId}/associate-kit`,
            kitData
        );
    }
    /**
     * Procura os detalhes de uma planta e do kit associado
     * @param plantId ID da planta
     */
    getPlantDetails(plantId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}plants/${plantId}/details`);
    }

    /**
     * Retorna as FAQs de uma planta
     * @param plantId ID da planta
     */
    getPlantFaqs(plantId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}plant-faqs/${plantId}`);
    }

    getWateringData(userPlantId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}plant/${userPlantId}/watering-data`);
    }

    removeKit(userPlantId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}plants/${userPlantId}/remove-kit`);
    }

    /**
     * Verifica a disponibilidade do código do kit
     * @param kitCode Código do kit
     */
    checkKitCodeAvailability(kitCode: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}kits/check-code/${kitCode}`);
    }

    /**
     * Atualiza o nome do kit
     * @param kitId ID do kit
     * @param newName Novo nome do kit
     */
    updateKitName(kitId: string, newName: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}kits/${kitId}/update-name`, { name: newName });
    }

    addWateringEntry(wateringEntry: { users_plants_id: number; watering_type: string }) {
        return this.http.post(`${this.apiUrl}watering/manual`, wateringEntry);
    }
}
