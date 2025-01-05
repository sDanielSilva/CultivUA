import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuizService } from './quiz.service';
import { environment } from 'src/environments/environment';

describe('QuizService', () => {
  let service: QuizService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/quiz`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizService]
    });
    service = TestBed.inject(QuizService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit answers', () => {
    const responses = { question1: 'answer1', question2: 'answer2' };
    service.submitAnswers(responses).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/submit`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ responses });
    req.flush({ success: true });
  });

  it('should get results', () => {
    const mockResults = { score: 10, correctAnswers: 5 };
    service.getResults().subscribe(results => {
      expect(results).toEqual(mockResults);
    });

    const req = httpMock.expectOne(`${apiUrl}/results`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
  });

  it('should get questions', () => {
    const mockQuestions = [{ id: 1, question: 'What is 2+2?' }];
    service.getQuestions().subscribe(questions => {
      expect(questions).toEqual(mockQuestions);
    });

    const req = httpMock.expectOne(`${apiUrl}/questions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockQuestions);
  });
});
