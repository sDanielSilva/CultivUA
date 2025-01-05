import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService, PurchaseHistory } from '../../services/user.service';
import { MaterialModule } from 'material.module';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatFormFieldModule, CommonModule, MatInputModule, MaterialModule],
  templateUrl: './filterable-table.component.html',
})
export class PurchaseHistoryComponent implements OnInit {
  displayedColumns: string[] = ['created_at', 'total_amount', 'products'];
  dataSource = new MatTableDataSource<PurchaseHistory>([]);
  loading = true;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private userService: UserService, private toastService: ToastService) { }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
      this.toastService.show('User not authenticated!', 'error');
      this.loading = false;
      return;
    }

    this.userService.getPurchaseHistory(userId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.show('Error loading history!', 'error');
        this.loading = false;
      },
    });
  }


}
