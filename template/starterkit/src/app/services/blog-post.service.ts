import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { BlogPost } from "../models/blog-post";
import { environment } from "../../environments/environment"; // Usar o environment
import { Category } from "../pages/categoriaAdmin/serviceinvoice.service";

@Injectable({
    providedIn: "root",
})
export class BlogPostService {
    private apiUrl = `${environment.apiUrl}/blog-posts`; // Link dinâmico

    constructor(private http: HttpClient) {}

    getPosts(): Observable<BlogPost[]> {
        return this.http.get<BlogPost[]>(this.apiUrl);
    }

    getPost(id: number): Observable<BlogPost> {
        return this.http.get<BlogPost>(`${this.apiUrl}/${id}`);
    }

    addPost(post: BlogPost): Observable<BlogPost> {
        return this.http.post<BlogPost>(this.apiUrl, post);

    }

    updatePost(id: number, post: BlogPost): Observable<BlogPost> {
        return this.http.put<BlogPost>(`${this.apiUrl}/${id}`, post);
    }

    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getComments(postId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${postId}/comments`).pipe(
            tap((response) => console.log("Resposta da API:", response)),
            catchError((error) => {
                console.error("Erro ao carregar comentários:", error);
                return throwError(() => new Error(error));
            })
        );
    }

    addComment(commentData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, commentData);
    }

    updateComment(commentId: number, commentData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${commentId}`, commentData);
    }

    deleteComment(commentId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${commentId}`);
    }

    updateCommentVisibility(
        commentId: number,
        isVisible: boolean
    ): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/comments/${commentId}`, {
            isVisible,
        });
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories`);
    }
}
