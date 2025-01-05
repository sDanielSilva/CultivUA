import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BlogUserService } from "../../services/blog-user.service";
import { MaterialModule } from "material.module";
import { CommonModule } from "@angular/common";
import { TablerIconsModule } from "angular-tabler-icons";
import { FormsModule } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";
import { ToastService } from "src/app/services/shared/toast.service";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "app-blogpost",
    templateUrl: "./post.component.html",
    styleUrls: ["./post.component.scss"],
    imports: [MaterialModule, CommonModule, TablerIconsModule, FormsModule],
    standalone: true,
})
export class AppBlogPostComponent implements OnInit {
    public blogDetail: any | null = null;
    newCommentContent: string = "";
    userProfileImage: string = ""; // Para armazenar a imagem do user

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogUserService,
        private cdr: ChangeDetectorRef,
        private toastService: ToastService,
        private http: HttpClient // Adicionado para chamadas HTTP diretas
    ) {}

    ngOnInit(): void {
        // Get the ID from the route
        const postId = this.route.snapshot.paramMap.get("id");
        if (postId) {
            this.blogService.getBlogById(postId).subscribe(
                (data: any) => {
                    this.blogDetail = data;

                    if (this.blogDetail.admin) {
                        // Admin profile image
                    }

                    if (this.blogDetail.comments) {
                        this.blogDetail.comments.forEach(
                            (comment: any, index: number) => {
                                // Comment
                            }
                        );
                    }
                },
                (error) => {
                    this.toastService.show("Error loading post details!", "error");
                }
            );
        }

        // Get user details
        const userId = sessionStorage.getItem("user_id");
        if (userId) {
            this.getUserDetails(userId);
        }
    }

    getUserDetails(userId: string): void {
        const url = `http://localhost:8000/api/userdetails/${userId}`;
        this.http.get<any>(url).subscribe(
            (response) => {
                this.userProfileImage = response.imagem;
            },
            (error) => {
                this.toastService.show("Error fetching user details!", "error");
            }
        );
    }

    postComment(): void {
        if (this.newCommentContent.trim()) {
            const userId = sessionStorage.getItem("user_id");

            if (!userId) {
                this.toastService.show("User not logged in!", "error");
                return;
            }

            const comment = {
                comment_text: this.newCommentContent,
                user_id: parseInt(userId, 10),
                post_id: this.blogDetail.id,
            };

            this.blogService.addComment(comment).subscribe(
                (response: any) => {
                    // Add the comment to the array based on returned data
                    const newComment = {
                        username: response.user.username,
                        profile_image: this.userProfileImage || "../../../assets/images/profile/user-1.jpg",
                        content: response.comment_text,
                        created_at: response.created_at,
                    };

                    this.blogDetail.comments.push(newComment);

                    // Update the comment count
                    this.blogDetail.comments_count += 1;

                    // Clear the comment field
                    this.newCommentContent = "";

                    // Force view update
                    this.cdr.detectChanges();
                },
                (error) => {
                    this.toastService.show("Error adding comment!", "error");
                }
            );
        }
    }
}
