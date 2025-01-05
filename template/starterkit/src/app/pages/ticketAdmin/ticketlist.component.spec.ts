import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AppTicketlistComponent, TicketElement } from './ticketlist.component';
import { TicketAdminService } from 'src/app/services/ticketAdmin.service';


describe('AppTicketlistComponent', () => {
    let component: AppTicketlistComponent;
    let fixture: ComponentFixture<AppTicketlistComponent>;
    let ticketAdminService: TicketAdminService;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          MatDialogModule,
          MatSnackBarModule,
          MatTableModule,
          BrowserAnimationsModule,
          TablerIconsModule.pick({ /* add your icons here */ }),
          HttpClientTestingModule,
          AppTicketlistComponent, // A importar o componente sem o TablerIconsModule
        ],
          
        providers: [
            provideHttpClientTesting(),
          TicketAdminService,
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} },
        ],
      }).compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(AppTicketlistComponent);
      component = fixture.componentInstance;
      ticketAdminService = TestBed.inject(TicketAdminService);
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should load tickets on init', () => {
      const tickets: TicketElement[] = [
        { id: 1, subject: 'Test', message: 'Test message', status: 'open', created_at: '2023-01-01', updated_at: '2023-01-01', response: '' },
      ];
      spyOn(ticketAdminService, 'getTickets').and.returnValue(of(tickets));
      component.ngOnInit();
      expect(component.dataSource.data).toEqual(tickets);
    });
  
    it('should update ticket counts', () => {
      component.dataSource.data = [
        { id: 1, subject: 'Test', message: 'Test message', status: 'open', created_at: '2023-01-01', updated_at: '2023-01-01', response: '' },
        { id: 2, subject: 'Test', message: 'Test message', status: 'closed', created_at: '2023-01-01', updated_at: '2023-01-01', response: '' },
        { id: 3, subject: 'Test', message: 'Test message', status: 'inprogress', created_at: '2023-01-01', updated_at: '2023-01-01', response: '' },
      ];
      component.updateCounts();
      expect(component.totalCount).toBe(3);
      expect(component.Open).toBe(1);
      expect(component.Closed).toBe(1);
      expect(component.Inprogress).toBe(1);
    });
  
    it('should apply filter', () => {
      component.applyFilter('test');
      expect(component.dataSource.filter).toBe('test');
    });
  
    it('should sort table', () => {
      component.dataSource.data = [
        { id: 1, subject: 'Test', message: 'Test message', status: 'closed', created_at: '2023-01-01', updated_at: '2023-01-01', response: '' },
        { id: 2, subject: 'Test', message: 'Test message', status: 'open', created_at: '2023-01-02', updated_at: '2023-01-02', response: '' },
      ];
      component.sortTable();
      expect(component.dataSource.data[0].status).toBe('open');
    });
  
    it('should format date correctly', () => {
      const date = new Date('2023-01-01');
      const formattedDate = component.formatDate(date);
      expect(formattedDate).toBe('2023-01-01');
    });
  
    it('should update row data', () => {
      const ticket: TicketElement = { id: 1, subject: 'Test', message: 'Test message', status: 'open', created_at: '2023-01-01', updated_at: '2023-01-01', response: '' };
      spyOn(ticketAdminService, 'updateTicket').and.returnValue(of(ticket));
      component.updateRowData(ticket);
      expect(ticketAdminService.updateTicket).toHaveBeenCalledWith(1, ticket);
    });
  
    it('should delete row data', () => {
      const ticket: TicketElement = { id: 1, subject: 'Test', message: 'Test message', status: 'open', created_at: '2023-01-01', updated_at: '2023-01-01', response: '' };
      spyOn(ticketAdminService, 'deleteTicket').and.returnValue(of(ticket));
      component.deleteRowData(ticket);
      expect(ticketAdminService.deleteTicket).toHaveBeenCalledWith(1);
    });
  });