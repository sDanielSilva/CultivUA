import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from '../models/blog-post';
import { environment } from '../../environments/environment';

describe('BlogPostService', () => {
  let service: BlogPostService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/blog-posts`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogPostService]
    });
    service = TestBed.inject(BlogPostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all blog posts', () => {
    const dummyPosts: BlogPost[] = [
      {
        id: 1, title: 'Post 1', content: 'Content 1',
        is_highlighted: false,
        featuredPost: 0,
        categoria_id: 0,
        reading_time: 0,
        status: '',
        admins_id: 0,
        created_at: new Date()
      },
      {
        id: 2, title: 'Post 2', content: 'Content 2',
        is_highlighted: false,
        featuredPost: 0,
        categoria_id: 0,
        reading_time: 0,
        status: '',
        admins_id: 0,
        created_at: new Date()
      }
    ];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(dummyPosts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should retrieve a single blog post by id', () => {
    const dummyPost: BlogPost = {
      id: 1, title: 'Post 1', content: 'Content 1',
      is_highlighted: false,
      featuredPost: 0,
      categoria_id: 0,
      reading_time: 0,
      status: '',
      admins_id: 0,
      created_at: new Date()
    };

    service.getPost(1).subscribe(post => {
      expect(post).toEqual(dummyPost);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('should add a new blog post', () => {
    const newPost: BlogPost = {
      id: 3, title: 'Post 3', content: 'Content 3',
      is_highlighted: false,
      featuredPost: 0,
      categoria_id: 0,
      reading_time: 0,
      status: '',
      admins_id: 0,
      created_at: new Date()
    };

    service.addPost(newPost).subscribe(post => {
      expect(post).toEqual(newPost);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newPost);
  });

  it('should update an existing blog post', () => {
    const updatedPost: BlogPost = {
      id: 1, title: 'Updated Post', content: 'Updated Content',
      is_highlighted: false,
      featuredPost: 0,
      categoria_id: 0,
      reading_time: 0,
      status: '',
      admins_id: 0,
      created_at: new Date()
    };

    service.updatePost(1, updatedPost).subscribe(post => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPost);
  });

  it('should delete a blog post', () => {
    service.deletePost(1).subscribe(response => {
      expect(response).toBeNull(); 
    });
  
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); 
  });
});
