import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppDoughnutpieChartAdminComponent } from 'src/app/components/doughnut-pieAdmin/doughnut-pieAdmin.component';
import { MaterialModule } from 'src/app/material.module';
import { DatePipe } from '@angular/common';
import { routes } from 'src/app/app.routes';
import { AppAccountSettingComponent } from "../../components/dashboardpu/dashboardpu.component";
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'perfil-user',
  templateUrl: './dashboardperfilutilizador.component.html',
  styleUrls: ['./dashboardperfilutilizador.component.scss'],
  standalone: true,
  imports: [MaterialModule, RouterModule, AppAccountSettingComponent],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class PerfilUtilizadorComponent implements OnInit  {

  username: string = "";
  email: string = "";
  todayDate: string = ""; // Declarando a v.ariável para armazenar a data

  constructor(
    private AuthService: AuthService,
    private router: Router,
    private userService: UserService,
    private datePipe: DatePipe,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    // Definir a data de hoje
    const currentDate = new Date();
    this.todayDate = this.datePipe.transform(currentDate, 'fullDate') || '';

    // Carregar detalhes do utilizador
    this.loadUserDetails();
  }

  // Carregar os detalhes do utilizador
  loadUserDetails(): void {
    const token = this.AuthService.getToken();
    if (token) {
      this.userService.getUserDetails().subscribe(
        (userData: any) => {
          this.username = userData.username || "username";
        },
        (error) => {
            this.toastService.show('Error fetching user data!', 'error');
        }
      );
    }
  }
}

