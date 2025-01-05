import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogUserService } from './blog-user.service';
import { environment } from 'src/environments/environment';

describe('BlogUserService', () => {
    let service: BlogUserService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/blog-posts`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BlogUserService]
        });
        service = TestBed.inject(BlogUserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch blog posts', () => {
        const dummyPosts = [{ title: 'Post 1' }, { title: 'Post 2' }];
        
        service.getBlog().subscribe(posts => {
            expect(posts.length).toBe(2);
            expect(posts).toEqual(dummyPosts);
        });

        const req = httpMock.expectOne(`${apiUrl}/`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyPosts);
    });

    it('should fetch a blog post by id', () => {
        const dummyPost = { title: 'Post 1' };
        const postId = '123';

        service.getBlogById(postId).subscribe(post => {
            expect(post).toEqual(dummyPost);
        });

        const req = httpMock.expectOne(`${apiUrl}/${postId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyPost);
    });

    it('should add a comment', () => {
        const dummyComment = { content: 'Nice post!' };

        service.addComment(dummyComment).subscribe(response => {
            expect(response).toEqual(dummyComment);
        });

        const req = httpMock.expectOne(`${apiUrl}/add-comment`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dummyComment);
        req.flush(dummyComment);
    });
});