import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}`;
    private tokenKey = "auth_token";

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        const token = this.getToken();
        this.setAuthenticated(!!token);
    }

    setAuthenticated(status: boolean): void {
        this.isAuthenticatedSubject.next(status);
    }

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticated$; // Retorna o estado observável de autenticação
    }

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap((response) => {
                this.setToken(response.token);
                this.setUserId(response.id);
                sessionStorage.setItem("user_email", response.email);
                sessionStorage.setItem("user_type", response.user_type);
                this.isAuthenticatedSubject.next(true);
            })
        );
    }
    
    loginAdmin(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/admin/login`, credentials).pipe(
            tap((response) => {
                this.setToken(response.token);
                sessionStorage.setItem("admin_id", response.id);
                sessionStorage.setItem("admin_email", response.email);
                sessionStorage.setItem("admin_name", response.username);
                sessionStorage.setItem("user_type", response.user_type);
                sessionStorage.setItem("admin_image", response.image);
                this.isAuthenticatedSubject.next(true);
            })
        );
    }    

    // Armazenar URL de redirecionamento
    setRedirectUrl(url: string) {
        sessionStorage.setItem("redirectUrl", url);
    }

    // Recuperar URL de redirecionamento
    getRedirectUrl() {
        return sessionStorage.getItem("redirectUrl");
    }

    redirectAfterLogin(): void {
        const returnUrl = this.getRedirectUrl() || "/dashboard"; // URL de redirecionamento ou /dashboard se não houver
        this.router.navigate([returnUrl]).then(() => {
            this.setRedirectUrl('');
            sessionStorage.removeItem("redirectUrl");
        });
    }

    setUserId(id: string): void {
        sessionStorage.setItem("user_id", id); // Armazena o ID no sessionStorage
    }

    getUserId(): string | null {
        return sessionStorage.getItem("user_id"); // Recupera o ID armazenado
    }

    removeUserId(): void {
        sessionStorage.removeItem("user_id"); // Remove o ID do armazenamento
    }

    // Registar um novo utilizador
    register(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, userData);
    }

    getUserDetails(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/user`);
    }

    logout(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders().set(
            "Authorization",
            `Bearer ${token}`
        );
        return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
            tap(() => {
                this.clearToken();
                this.removeUserId();
                sessionStorage.removeItem("user_email"); // Remover o e-mail
                this.isAuthenticatedSubject.next(false);
            })
        );
    }

    private setSessionItem(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    private getSessionItem(key: string): string | null {
        return sessionStorage.getItem(key);
    }

    private removeSessionItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    setToken(token: string): void {
        this.setSessionItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return this.getSessionItem(this.tokenKey);
    }

    removeToken(): void {
        this.removeSessionItem(this.tokenKey);
    }

    // Limpar o token da memória
    private clearToken(): void {
        this.removeToken();
    }

    getUserData(): Observable<any> {
        const userId = this.getUserId(); // Recupera o ID do user armazenado
        const email = sessionStorage.getItem("user_email"); // Recupera o email armazenado (se necessário)

        if (userId && email) {
            return new Observable((observer) => {
                observer.next({ id: userId, email: email }); // Retorna os dados do user
                observer.complete();
            });
        } else {
            return new Observable((observer) => {
                observer.next(null); // Se não encontrar os dados, retorna null
                observer.complete();
            });
        }
    }

    logoutAdmin(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/admin/logout`, {}, { headers }).pipe(
            tap(() => {
                this.clearToken();
                sessionStorage.removeItem("admin_id");
                sessionStorage.removeItem("admin_email");
                sessionStorage.removeItem("admin_name");
                sessionStorage.removeItem("admin_image");
                this.isAuthenticatedSubject.next(false);
            })
        );
    }
}