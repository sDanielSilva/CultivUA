import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TicketAdminService } from 'src/app/services/ticketAdmin.service';
import { ToastService } from 'src/app/services/shared/toast.service';

export interface TicketElement {
  id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  response: string;
  action?: string;
}

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticketlist.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, ],
})
export class AppTicketlistComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  searchText: any;
  totalCount = 0;
  Closed = 0;
  Inprogress = 0;
  Open = 0;

  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'date',
    'action',
  ];
  dataSource = new MatTableDataSource<TicketElement>([]);

  constructor(public dialog: MatDialog, private TicketAdminService: TicketAdminService, private snackBar: MatSnackBar, private toastService: ToastService) {}
 
  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.TicketAdminService.getTickets().subscribe((data) => {
      this.dataSource.data = data;
      this.updateCounts();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  btnCategoryClick(val: string): number {
    this.dataSource.filter = val.trim().toLowerCase();
    return this.dataSource.filteredData.length;
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;  // Garantir que o "action" seja atribuído
    const dialogRef = this.dialog.open(AppTicketDialogContentComponent, {
      data: obj,  // Passando todos os dados do ticket para o diálogo
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }


  updateCounts(): void {
    this.totalCount = this.dataSource.data.length;
    this.Open = this.dataSource.data.filter(ticket => ticket.status === 'open').length;
    this.Closed = this.dataSource.data.filter(ticket => ticket.status === 'closed').length;
    this.Inprogress = this.dataSource.data.filter(ticket => ticket.status === 'inprogress').length;
  }

  sortTable(): void {
    const sortedData = this.dataSource.data.sort((a, b) => {
      if (a.status === 'open' && b.status !== 'open') {
        return -1; 
      }
      if (a.status !== 'open' && b.status === 'open') {
        return 1;
      }
  
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  
    // Crie uma nova instância do MatTableDataSource
    this.dataSource = new MatTableDataSource(sortedData);
    this.dataSource.paginator = this.paginator; // Reaplique o paginador
  }

  formatDate(date: Date): string {
      const parsedDate = new Date(date);
    
      // Verifica se a data é válida
      if (isNaN(parsedDate.getTime())) {
        return ''; // Retorna uma string vazia se a data for inválida
      }
    
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const year = parsedDate.getFullYear();
      return `${year}-${month}-${day}`;

  }
  

  updateRowData(row_obj: TicketElement): boolean | any {
    this.TicketAdminService.updateTicket(row_obj.id, row_obj).subscribe(() => {
      this.loadTickets();
      this.toastService.show('Ticket updated successfully!', 'success');
    });  
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: TicketElement): boolean | any {
    this.TicketAdminService.deleteTicket(row_obj.id).subscribe(() => {
      this.loadTickets();
      this.toastService.show('Ticket deleted successfully!', 'success');
    });    
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'ticket-dialog-content.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})

export class AppTicketDialogContentComponent {
  action: string;
  local_data: TicketElement; // Garantir que o tipo seja TicketElement para garantir a estrutura

  constructor(
    public dialogRef: MatDialogRef<AppTicketDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TicketElement
  ) {
    this.local_data = { ...data };  // Copiando os dados recebidos para local_data
    this.action = this.local_data.action || ''; 
  }

  formatDate(date: Date): string {
    const parsedDate = new Date(date);
  
    // Verifica se a data é válida
    if (isNaN(parsedDate.getTime())) {
      return ''; // Retorna uma string vazia se a data for inválida
    }
  
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${year}-${month}-${day}`;

}

  doAction(): void {
    this.local_data.status = 'closed'; 
    this.local_data.updated_at = new Date().toISOString();
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
