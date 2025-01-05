import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class KitReadingService {
    private apiUrl = 'http://localhost:8000/api'; // URL base do backend

    constructor(private http: HttpClient) {}

    getReadingsByKitId(kitId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/kit-readings/${kitId}`);
    }

    isKitAvailable(code: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/kits/check-availability/${code}`);
    }
    
}
