import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AdminDashboardService } from '../../services/dashboard-admin.service';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CurrencyPipe,  CommonModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent {
  dashboardStats: any = {
    totalUsers: 0,
    totalProductsSold: 0,
    totalSales: 0,
    totalActiveGardens: 0,
    totalProducts: 0,
    totalQuestionsAnswered: 0,
  };

  constructor(private adminDashboardService: AdminDashboardService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.adminDashboardService.getDashboardStats().subscribe(
      (data) => {
        this.dashboardStats = data;
      },
      (error) => {
        this.toastService.show(`Error loading dashboard statistics`, 'error', 3000);
      }
    );
  }
  
}
