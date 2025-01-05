import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class TicketUserService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}

    createTicket(data: {
        user_id: number;
        email: string;
        subject: string;
        message: string;
    }): Observable<any> {
        console.log(data);
        return this.http.post<any>(`${this.apiUrl}/ticket-user`, data);
    }

    getUserTickets(): Observable<any> {
        return this.http.get(`${this.apiUrl}/tickets`);
      }
}
