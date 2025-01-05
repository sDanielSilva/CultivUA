import { Component, OnInit } from "@angular/core";
import { BlogPost } from "../../models/blog-post";
import { BlogPostService } from "../../services/blog-post.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgScrollbarModule } from "ngx-scrollbar";
import { TablerIconsModule } from "angular-tabler-icons";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/material.module";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { ViewChild, TemplateRef } from "@angular/core";
import { Category } from "src/app/pages/categoriaAdmin/serviceinvoice.service";
import { ToastService } from "src/app/services/shared/toast.service";

@Component({
    selector: "app-blog-posts",
    templateUrl: "./blog-posts.component.html",
    styleUrls: ["./blog-posts.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
})
export class BlogPostsComponent implements OnInit {
    @ViewChild("spinnerTemplate") spinnerTemplate!: TemplateRef<any>;
    @ViewChild("successTemplate") successTemplate!: TemplateRef<any>;
    sidePanelOpened = false;
    blogPosts: BlogPost[] = [];
    filteredPosts: BlogPost[] = [];
    selectedPost: BlogPost | null = null;
    searchText = "";
    comments: any[] = [];
    newPostForm: FormGroup;
    imagePreview: string | ArrayBuffer | null = null;
    selectedTabIndex: number = 0;
    loadingPosts = false; // Para controlar o loading das publicações
    loadingComments = false;
    categories: Category[] = [];

    constructor(
        private blogService: BlogPostService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private toastService: ToastService
    ) {
        this.newPostForm = this.fb.group({
            title: ["", [Validators.required, Validators.maxLength(255)]],
            content: ["", [Validators.required]],
            isHighlighted: [false],
            categoria_id: ["", Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadPosts();
        this.blogService.getCategories().subscribe((categories) => {
            this.categories = categories;
        });
    }

    loadPosts() {
        this.loadingPosts = true;
        this.blogService.getPosts().subscribe(
            (posts) => {
                this.blogPosts = posts; // Corrigido para preencher a lista original
                this.filteredPosts = posts;
                this.loadingPosts = false;
            },
            (error: any) => {
                this.loadingPosts = false;
                // Tratamento de erro
            }
        );
    }

    applyFilter(): void {
        this.filteredPosts = this.blogPosts.filter((post) =>
            post.title.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    loadComments(postId: number): void {
        this.loadingComments = true;

        this.blogService.getComments(postId).subscribe(
            (comments) => {
                console.log("Comments loaded", comments),
                this.comments = comments
                    .map((comment) => ({
                        id: comment.comment_id,
                        author: comment.username,
                        content: comment.comment_text,
                        timestamp: comment.commented_at,
                        authorAvatar: comment.imagem,
                        isVisible: comment.isVisible,
                    }))
                    .sort(
                        (a, b) =>
                            (a.isVisible === 0 ? 1 : 0) -
                            (b.isVisible === 0 ? 1 : 0)
                    );
                this.loadingComments = false;
            },
            (error: any) => {
                this.loadingComments = false;
                // Tratamento de erro
            }
        );
    }

    toggleCommentVisibility(comment: any) {
        // Atualizar a visibilidade do comentário no array localmente
        comment.isVisible = comment.isVisible === 0 ? 1 : 0; // alterna entre 0 e 1

        // Chamar o serviço para atualizar no backend
        this.blogService
            .updateCommentVisibility(comment.id, comment.isVisible)
            .subscribe(
                (response) => {
                    console.log(
                        "Comment visibility updated in the backend"
                    );
                    // Aqui pode ser adicionado algum feedback, se necessário
                },
                (error) => {
                    comment.isVisible = comment.isVisible === 0 ? 1 : 0; // Reverter
                }
            );
    }

    onSelectPost(post: BlogPost): void {
        this.selectedPost = post;

        // Preenche o formulário com os dados do post selecionado
        this.newPostForm.patchValue({
            title: post.title,
            content: post.content,
            categoria_id: Number(post.categoria_id),
            isHighlighted: post.featuredPost === 1,
        });

        this.selectedTabIndex = 0;

        if (post.id) {
            this.loadComments(post.id); // Carregar comentários
        }
        // Preencher a imagem no preview se existir
        if (post.image) {
            this.imagePreview = post.image; // post.image deve conter o URL ou base64
        } else {
            this.imagePreview = null;
        }
    }
    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    addNewPost(): void {
        if (this.newPostForm.valid) {

            const newPost: BlogPost = {
                ...this.newPostForm.value,
                is_highlighted: this.newPostForm.value.isHighlighted ? 1 : 0,
                image: this.imagePreview,
                status: "published",
                admins_id: 7,
                created_at: new Date(),
            };

            this.blogService
                .addPost({
                    ...newPost,
                    categoria_id: newPost.categoria_id,
                })
                .subscribe(
                    () => {
                        this.loadPosts();
                        this.newPostForm.reset();
                        this.imagePreview = null;

                        this.toastService.show('Post successfully created!', 'success');
                    },
                    (error) => {
                        this.toastService.show('Error creating post!', 'error');
                    }
                );
        } else {
            console.warn(
                "Invalid form. Please check the required fields."
            );
        }
    }

    savePost(): void {
        if (this.newPostForm.valid && this.selectedPost) {

            const updatedPost: BlogPost = {
                ...this.selectedPost,
                ...this.newPostForm.value,
                image: this.imagePreview,
                status: "published",
                admins_id: 7,
            };

            if (updatedPost.id !== undefined) {
                this.blogService
                    .updatePost(updatedPost.id, updatedPost)
                    .subscribe(() => {
                        this.loadPosts();
                        this.cancelEdit();

                        this.toastService.show('Post successfully updated!', 'success');
                    });
            }
        }
    }

    trackByPostId(index: number, post: BlogPost): number {
        return post.id!;
    }

    confirmRemovePost(post: BlogPost): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "400px",
            data: {
                title: post.title,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {

                this.blogService.deletePost(post.id!).subscribe(() => {
                    this.loadPosts();
                    this.toastService.show('Post successfully removed!', 'success');
                });
            }
        });
    }

    removePost(post: BlogPost): void {
        this.blogService.deletePost(post.id!).subscribe(() => {
            this.blogPosts = this.blogPosts.filter((p) => p.id !== post.id);
            this.filteredPosts = this.filteredPosts.filter(
                (p) => p.id !== post.id
            );
            if (this.selectedPost?.id === post.id) {
                this.cancelEdit();
            }
        });
    }

    cancelEdit(): void {
        this.selectedPost = null;
        this.newPostForm.reset();
        this.imagePreview = null;
    }

    isOver(): boolean {
        return window.innerWidth < 768;
    }
    /*
    showInfoDialog(text: string, element: any): void {
        this.dialog.open(InfoDialogComponent, {
            data: { text, element },
            width: "300px",
            disableClose: true,
        });
    } */
}
