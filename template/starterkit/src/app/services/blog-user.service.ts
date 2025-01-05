import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class BlogUserService {
    blogPosts: any[] = [];
    private apiUrl = `${environment.apiUrl}/blog-posts`;

    constructor(private http: HttpClient) {}

    getBlog(): Observable<any> {
        return this.http.get(`${this.apiUrl}/`).pipe(
            tap((data: any) => {
                this.blogPosts = data;
            })
        );
    }

    getBlogById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    addComment(comment: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/add-comment`, comment);
    }
}
