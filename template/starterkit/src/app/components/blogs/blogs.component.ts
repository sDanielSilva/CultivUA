import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BlogUserService } from "../../services/blog-user.service"; // Serviço para obter todos os posts
import { MatCardModule } from "@angular/material/card";
import { TablerIconsModule } from "angular-tabler-icons";
import { MatChipsModule } from "@angular/material/chips";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-blogs",
    standalone: true,
    imports: [MatCardModule, TablerIconsModule, MatChipsModule, CommonModule],
    templateUrl: "./blogs.component.html",
    styleUrls: ["./blogs.component.scss"],
})
export class AppBlogsComponent implements OnInit {
    public blogPosts: any[] = [];

    constructor(
        public router: Router,
        public blogService: BlogUserService // Serviço para posts
    ) {}

    // Função para selecionar o post e redirecionar para a página de detalhes
    selectBlog(id: string) {
        this.router.navigate(["/blogpost", id]);
    }

    ngOnInit(): void {
        this.blogService.getBlog().subscribe((data: any) => {
            this.blogPosts = data; // Atualizar os posts locais
        });
    }

    trackByFn(index: number, item: any): any {
        return item.user || index;
    }
}
