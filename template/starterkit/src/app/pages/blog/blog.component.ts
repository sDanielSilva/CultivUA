import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { AppBlogsComponent } from 'src/app/components/blogs/blogs.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  standalone: true,
  imports: [MaterialModule, AppBlogsComponent, CommonModule],
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {}

