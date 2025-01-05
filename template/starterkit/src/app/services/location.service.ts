import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Location } from "../pages/locations/locations/locations";
@Injectable({
    providedIn: "root",
})
export class LocationService {
    private baseUrl = `${environment.apiUrl}/locations`;
    private apiUrl = "http://localhost:8000/api/kit-readings";

    constructor(private http: HttpClient) {}

    // Método para procurar todas as locations
    getLocations(): Observable<any[]> {
        return this.http.get<{ id: number; name: string }[]>(this.baseUrl);
    }
    deleteLocation(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
    getLocationById(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/${id}`);
    }
    getKitReadings(kitId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${kitId}`);
    }

    addLocation(location: { name: string }): Observable<any> {
        return this.http.post<any>(this.baseUrl, location);
    }

    updateLocation(id: number, location: Location): Observable<Location> {
        return this.http.put<Location>(`${this.baseUrl}/${id}`, location);
    }
}
