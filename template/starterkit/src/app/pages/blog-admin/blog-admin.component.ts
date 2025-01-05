import { Component } from '@angular/core';
import { BlogPostsComponent } from "../../components/blog-posts/blog-posts.component";

@Component({
  selector: 'app-notes1',
  standalone: true,
  imports: [BlogPostsComponent],
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.scss']
})
export class BlogAdminComponent {}
