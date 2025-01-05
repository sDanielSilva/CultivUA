// QuizService
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class QuizService {
    private apiUrl = `${environment.apiUrl}/quiz`;

    constructor(private http: HttpClient) {}

    // Submete as respostas do quiz
    submitAnswers(responses: Record<string, string>): Observable<any> {
        return this.http.post(`${this.apiUrl}/submit`, { responses }); // Envia respostas dentro de "responses"
    }

    // Obtém os resultados do quiz
    getResults(): Observable<any> {
        return this.http.get(`${this.apiUrl}/results`);
    }

    // Obtém as perguntas do backend
    getQuestions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/questions`);
    }
}
