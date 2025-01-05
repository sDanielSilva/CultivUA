import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";

export interface Plant {
    id: number;
    common_name: string;
    default_image?: {
        thumbnail?: string;
    };
}

@Injectable({
    providedIn: "root",
})
export class PlantService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}

    searchPlant(name: string): Observable<{ plants: Plant[] }> {
        return this.http
            .post<{ plants: Plant[] }>(`${this.apiUrl}/plants/search`, { name })
            .pipe(
                tap((response) =>
                    console.log("Resposta recebida do servidor:", response)
                ),
                catchError((error) => {
                    console.error("Erro na requisição para o servidor:", error);
                    throw error;
                })
            );
    }

    addPlantToDashboard(plantId: number, plantName: string): Observable<any> {
        return this.http
            .post(`${this.apiUrl}/user-plants/add`, {
                plant_id: plantId,
                plant_name: plantName,
            })
            .pipe(
                tap((response) => {
                    // Adicione logs para verificar a resposta
                    console.log(
                        "Resposta recebida ao adicionar a planta ao dashboard:",
                        response
                    );
                }),
                catchError((error) => {
                    // Tratamento de erro
                    console.error(
                        "Erro ao adicionar a planta ao dashboard:",
                        error
                    );
                    throw error; // Rethrow para ser tratado em outro lugar, se necessário
                })
            );
    }

    identifyPlant(
        file: File,
        coordinates: { lat: number; lon: number } | null
    ): Observable<any> {
        const formData = new FormData();
        formData.append("images[]", file, file.name);

        if (coordinates) {
            formData.append("latitude", coordinates.lat.toString()); // Usar 'latitude' e 'longitude'
            formData.append("longitude", coordinates.lon.toString());
        }
        const formDataLog = new FormData();
        formData.forEach((value, key) => {
            formDataLog.append(key, value);
        });
        console.log("FormData being sent:", formDataLog);

        return this.http.post(`${this.apiUrl}/identify-plant`, formData);
    }

    savePlant(plantData: any, id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/plants/${id}`, plantData);
    }
}
