import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketUserService } from './ticket-user.service';
import { environment } from 'src/environments/environment';

describe('TicketUserService', () => {
    let service: TicketUserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TicketUserService]
        });
        service = TestBed.inject(TicketUserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create a ticket', () => {
        const mockData = {
            user_id: 1,
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test Message'
        };

        service.createTicket(mockData).subscribe(response => {
            expect(response).toEqual(mockData);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/ticket-user`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockData);
        req.flush(mockData);
    });

    it('should get user tickets', () => {
        const mockTickets = [
            { id: 1, subject: 'Test Subject 1', message: 'Test Message 1' },
            { id: 2, subject: 'Test Subject 2', message: 'Test Message 2' }
        ];

        service.getUserTickets().subscribe(tickets => {
            expect(tickets).toEqual(mockTickets);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/tickets`);
        expect(req.request.method).toBe('GET');
        req.flush(mockTickets);
    });
});