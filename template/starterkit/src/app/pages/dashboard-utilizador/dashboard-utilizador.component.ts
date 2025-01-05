import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { DatePipe } from '@angular/common';
import { CardComponent } from 'src/app/components/dashboard/card/card.component';
import { PlantListComponent } from 'src/app/components/dashboard/plant-list/plant-list.component';
import { DashboardPlantService } from 'src/app/services/dashboardplant.service';
import { ChangeDetectorRef } from '@angular/core'; // Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { AppFaqComponent } from 'src/app/components/kits/faq/faq.component';
import { ToastService } from 'src/app/services/shared/toast.service';
@Component({
  selector: 'app-dashboard-utilizador',
  templateUrl: './dashboard-utilizador.component.html',
  styleUrls: ['./dashboard-utilizador.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MaterialModule, CardComponent, PlantListComponent, CommonModule, AppFaqComponent],
  providers: [DatePipe]
})
export class DashboardUtilizadorComponent implements OnInit {
  username: string = "";
  email: string = "";
  todayDate: string = "";
  hasPlants: boolean = false; // Nova propriedade para verificar se o utilizador tem plantas
  isLoading: boolean = true;  // Variável para controlar o estado de loading

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private plantService: DashboardPlantService, // Injetar serviço de plantas
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Definir a data de hoje
    const currentDate = new Date();
    this.todayDate = this.datePipe.transform(currentDate, 'fullDate') || '';

    // Carregar detalhes do utilizador
    this.loadUserDetails();
    this.checkUserPlants(); // Chamar a função para verificar plantas do utilizador
  }

  // Carregar os detalhes do utilizador
  loadUserDetails(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userService.getUserDetails().subscribe(
        (userData: any) => {
          this.username = userData.username || "Utilizador";
          this.email = userData.email || "Email";
        },
        (error) => {
          this.toastService.show('Error fetching user data!', 'error');
        }
      );
    }
  }

  checkUserPlants(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.plantService.getUserPlants(userId).subscribe((data: any[]) => {
        this.hasPlants = data.length > 0; // Se o utilizador tiver plantas, setar 'hasPlants' para true
        this.isLoading = false; // Definir isLoading como false após os dados serem carregados
      }, (error) => {
        this.toastService.show('Error loading plants!', 'error');
        this.isLoading = false; // Definir isLoading como false mesmo em caso de erro
      });
    }
  }
}
