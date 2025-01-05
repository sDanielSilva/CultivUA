import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
export interface PurchaseHistory {
    id: number;
    total_amount: number;
    created_at: string;
}

@Injectable({
    providedIn: "root",
})


export class UserService {
    constructor(private http: HttpClient, private authService: AuthService) { }
    private apiUrl = `${environment.apiUrl}`;

    getUserDetails(): Observable<User> {
        const token = this.authService.getToken();

        return this.http.get<User>(`${this.apiUrl}/user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    updateNewsletterSubscription(isSubscribed: boolean): Observable<any> {
        const userId = sessionStorage.getItem("user_id");
        console.log("userId recuperado: ", userId); // Log para verificar se o userId está a ser recuperado

        if (!userId) {
            console.error("Erro: userId não encontrado na sessionStorage");
            return new Observable(observer => {
                observer.error("Erro: userId não encontrado na sessionStorage");
            }); // Previne a chamada da API se o userId não for encontrado
        }

        return this.http.put<any>(`${this.apiUrl}/users/${userId}/newsletter`, {
            newsletter: isSubscribed ? 1 : 0,
        });
    }

    getUserDetailsHeader(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/userdetails/${userId}`);
    }

    updateProfilePicture(imageBase64: string): Observable<any> {
        const userId = sessionStorage.getItem("user_id");
        console.log("userId recuperado: ", userId); // Log para verificar se o userId está a ser recuperado

        if (!userId) {
            console.error("Erro: userId não encontrado na sessionStorage");
            return new Observable(observer => {
                observer.error("Erro: userId não encontrado na sessionStorage");
            }); // Previne a chamada da API se o userId não for encontrado
        }

        const payload = { imagem: imageBase64 };
        return this.http.put<any>(`${this.apiUrl}/users/${userId}/profile-picture`, payload);
    }

    getPurchaseHistory(userId: string): Observable<PurchaseHistory[]> {
        return this.http.get<PurchaseHistory[]>(`${this.apiUrl}/users/${userId}/purchase-history`);
    }    
}
