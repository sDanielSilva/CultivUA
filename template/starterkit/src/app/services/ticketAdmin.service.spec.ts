import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketAdminService, TicketElement } from './ticketAdmin.service';
import { environment } from 'src/environments/environment';

describe('TicketAdminService', () => {
    let service: TicketAdminService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TicketAdminService]
        });
        service = TestBed.inject(TicketAdminService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch tickets', () => {
        const dummyTickets: TicketElement[] = [
            { id: 1, title: 'Test Ticket 1', subtext: 'Subtext 1', status: 'open', date: '2023-01-01', response: 'Response 1' },
            { id: 2, title: 'Test Ticket 2', subtext: 'Subtext 2', status: 'closed', date: '2023-01-02', response: 'Response 2' }
        ];

        service.getTickets().subscribe(tickets => {
            expect(tickets.length).toBe(2);
            expect(tickets).toEqual(dummyTickets);
        });

        const req = httpMock.expectOne(`${apiUrl}/tickets`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyTickets);
    });

    it('should update a ticket', () => {
        const updatedTicket: TicketElement = { id: 1, title: 'Updated Ticket', subtext: 'Updated Subtext', status: 'open', date: '2023-01-01', response: 'Updated Response' };

        service.updateTicket(1, updatedTicket).subscribe(ticket => {
            expect(ticket).toEqual(updatedTicket);
        });

        const req = httpMock.expectOne(`${apiUrl}/updateTicket/1`);
        expect(req.request.method).toBe('PUT');
        req.flush(updatedTicket);
    });

    it('should delete a ticket', () => {
        service.deleteTicket(1).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(`${apiUrl}/deleteTicket/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({ success: true });
    });
});