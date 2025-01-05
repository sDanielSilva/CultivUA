import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { KitReadingService } from "../../services/kit-reading.service";
import { CommonModule } from "@angular/common";
import { AppLineChartComponent } from "src/app/components/dashboard/line/line.component";
import { ChartOptions } from "src/app/components/dashboard/line/line.component";
import { MatCardModule } from "@angular/material/card";
import { AppAreaChartComponent } from "src/app/components/dashboard/area/area.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { DashboardPlantService } from "src/app/services/dashboardplant.service";
import { ChangeDetectorRef } from "@angular/core";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MaterialModule } from "../../material.module";
import { CalendarModule } from 'angular-calendar'; // Importação necessária
import { addDays, startOfDay } from 'date-fns'; // Funções para manipulação de datas
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns';
import { ToastService } from "src/app/services/shared/toast.service";

@Component({
    selector: "app-kits-planta",
    templateUrl: "./kits-planta.component.html",
    styleUrls: ["./kits-planta.component.css"],
    imports: [
        CommonModule,
        AppLineChartComponent,
        MatCardModule,
        AppAreaChartComponent,
        NgApexchartsModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTabsModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MaterialModule,
    ],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class KitsPlanta implements OnInit {
    /* Daqui para baixo e o codigo da logica dos kits */

    kitData: any;
    kitReadings: any[] = [];
    isLoading: boolean = true;
    plantFaqs: any[] = []; // FAQ da planta
    plantId: number; // ID da planta
    userPlantId: number;
    wateringHistory: Date[] = [];
    nextWateringDays: Date[] = [];
    isDataLoaded = false;
    calendarEvents: CalendarEvent[] = [];
    @ViewChild('calendar') calendar: any;
    today: Date = new Date();
    viewDate: Date = new Date();

    // Ajuste do tipo para corresponder ao esperado
    lineChartOptions: Partial<ChartOptions> = {
        series: [],
        chart: { type: "line", height: 300 },
        xaxis: { categories: [] },
        yaxis: { title: { text: "Valores" } },
        colors: ["#FF5733", "#33C3FF", "#33FF57"],
        legend: { position: "top" },
        tooltip: { shared: true, intersect: false },
    };


    temperatureChartOptions: Partial<ChartOptions> = {};
    humidityChartOptions: Partial<ChartOptions> = {};
    lightChartOptions: Partial<ChartOptions> = {};

    constructor(
        private router: Router,
        private kitReadingService: KitReadingService,
        private dashboardPlantService: DashboardPlantService,
        private cdr: ChangeDetectorRef,
        private toastService: ToastService,
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.kitData = navigation?.extras.state?.["kitData"] || null;
    }

    ngOnInit(): void {
        const kitData = sessionStorage.getItem("kitData");

        if (kitData) {
            this.kitData = JSON.parse(kitData);

            if (this.kitData?.Planta?.kits?.length > 0) {
                const kitId = this.kitData.Planta.kits[0].id;

                this.getKitReadings(kitId);
                this.plantId = this.kitData.Planta.id;
                this.getPlantFaqs();
                this.userPlantId = this.kitData.user_plant_id;
                this.fetchWateringData();
            } else {
                this.toastService.show('Invalid or not found KitData!', 'error');
                this.isLoading = false;
            }
        } else {
            this.isLoading = false;
            this.router.navigate(["/dashboard"]);
        }
    }

    ngOnDestroy(): void {
        // Limpar o sessionStorage quando o componente for destruído (opcional)
        sessionStorage.removeItem("kitData");
    }

    getKitReadings(kitId: number): void {
        this.kitReadingService.getReadingsByKitId(kitId).subscribe({
            next: (data) => {
                this.kitReadings = Array.isArray(data) ? data : [];
                this.updateChartData();
                this.setupCharts(); // Atualiza os gráficos
                this.isLoading = false; // Dados carregados, oculta o spinner
                this.cdr.detectChanges(); // Trigger change detection
            },
            error: (error) => {
                this.toastService.show('Error fetching Kit Reading data!', 'error');
                this.isLoading = false; // Se ocorrer erro, oculta o spinner
                this.cdr.detectChanges(); // Trigger change detection
            },
        });
    }

    getPlantFaqs(): void {
        this.dashboardPlantService.getPlantFaqs(this.plantId).subscribe(
            (faqs) => {
                this.plantFaqs = faqs; // Armazenar as FAQs na variável plantFaqs
                this.isLoading = false;
            },
            (error) => {
                this.toastService.show('Error fetching FAQs!', 'error');
                this.isLoading = false;
            }
        );
    }

    fetchWateringData(): void {
        this.dashboardPlantService.getWateringData(this.userPlantId).subscribe(
            (data) => {

                // Processar histórico de rega
                this.wateringHistory = data.watering_history.map((item: any) => new Date(item.created_at));

                // Processar próximos dias de rega
                const [min, max] = data.watering_frequency.split("-").map(Number);
                const lastWateringDate = new Date(this.wateringHistory[this.wateringHistory.length - 1]);

                this.nextWateringDays = [];
                for (let i = min; i <= max; i++) {
                    const nextDate = new Date(lastWateringDate);
                    nextDate.setDate(lastWateringDate.getDate() + i);
                    this.nextWateringDays.push(nextDate);
                }

                // Atualizar o calendário após a obtenção dos dados
                if (this.calendar) {
                    this.calendar.updateTodaysDate();
                }

                // Marcar dados carregados
                this.isDataLoaded = true;
            },
            (error) => {
                this.toastService.show('Error loading watering data', 'error', 3000);
            }
        );
    }

    // Método para impedir seleção de datas
    preventDateSelection(event: any): void {
        event.preventDefault();
        event.stopPropagation();
    }


    dateClass = (date: Date): string => {
        const dateISO = date.toISOString().split('T')[0];

        if (this.wateringHistory.some((d) => d.toISOString().split('T')[0] === dateISO)) {
            return 'watered'; // Dia regado
        }
        if (this.nextWateringDays.some((d) => d.toISOString().split('T')[0] === dateISO)) {
            return 'next-watering'; // Próxima rega
        }
        return '';
    };




    markWatering(): void {
        if (!this.kitData?.user_plant_id) {
          this.toastService.show('Error: Plant ID not found.', 'error', 3000);
          return;
        }
      
        const wateringEntry = {
          users_plants_id: this.kitData.user_plant_id,
          watering_type: 'manual',
        };
      
        this.dashboardPlantService.addWateringEntry(wateringEntry).subscribe({
          next: () => {
            this.toastService.show('Watering marked successfully!', 'success', 3000);
            this.fetchWateringData();
          },
          error: (err: any) => {
            this.toastService.show('Error marking watering. Please try again.', 'error', 3000);
          },
        });
      }
      

      updateChartData(): void {
        if (!this.kitReadings.length) return;

        const temperatureData = this.kitReadings.map(
            (reading) => reading.temperatura
        );
        const lightData = this.kitReadings.map((reading) => reading.luz);
        const humidityData = this.kitReadings.map(
            (reading) => reading.humidade
        );
        const timestamps = this.kitReadings.map((reading) =>
            new Date(reading.timestmp).toLocaleTimeString()
        );

        this.lineChartOptions = {
            series: [
                { name: "Temperature", data: temperatureData },
                { name: "Light", data: lightData },
                { name: "Humidity", data: humidityData },
            ],
            xaxis: { categories: timestamps },
        };

        this.cdr.detectChanges(); // Trigger change detection
    }

    setupCharts(): void {
        const timestamps = this.kitReadings.map((reading) =>
            new Date(reading.timestmp).toLocaleTimeString()
        );

        this.temperatureChartOptions = {
            series: [
            {
                name: "Current",
                data: this.kitReadings.map((r) => r.temperatura),
            },
            {
                name: "Ideal",
                data: this.kitReadings.map(
                () => this.kitData.Planta.ideal_temperature
                ),
            },
            ],
            xaxis: { categories: timestamps },
            yaxis: { title: { text: "Temperature (°C)" } },
            colors: ["#FF5733", "#FFC300"],
        };

        this.humidityChartOptions = {
            series: [
            {
                name: "Current",
                data: this.kitReadings.map((r) => r.humidade),
            },
            {
                name: "Ideal",
                data: this.kitReadings.map(
                () => this.kitData.Planta.ideal_humidity
                ),
            },
            ],
            xaxis: { categories: timestamps },
            yaxis: { title: { text: "Humidity (%)" } },
            colors: ["#33C3FF", "#33FF57"],
        };

        this.lightChartOptions = {
            series: [
            { name: "Current", data: this.kitReadings.map((r) => r.luz) },
            {
                name: "Ideal",
                data: this.kitReadings.map(
                () => this.kitData.Planta.ideal_light || 0
                ),
            },
            ],
            xaxis: { categories: timestamps },
            yaxis: { title: { text: "Light (Lux)" } },
            colors: ["#FFC107", "#8BC34A"],
        };

        this.cdr.detectChanges(); // Trigger change detection

    }

    getTemperatureClass(temperatura: number, ideal: number): string {
        if (!temperatura || !ideal) {
            return 'card-laranja'; // Cor de erro
        }

        const diff = Math.abs(temperatura - ideal);
        if (diff <= 2) {
            return 'card-verde'; // Ideal
        } else if (diff <= 5) {
            return 'card-amarelo'; // Abaixo ou acima da média
        } else {
            return 'card-laranja'; // Muito fora do ideal
        }
    }

    getLightClass(luz: number, ideal: number): string {
        if (!luz || !ideal) {
            return 'card-laranja';
        }

        const diff = Math.abs(luz - ideal);
        if (diff <= 50) {
            return 'card-verde';
        } else if (diff <= 100) {
            return 'card-amarelo';
        } else {
            return 'card-laranja';
        }
    }

    getHumidityClass(humidade: number, ideal: number): string {
        if (!humidade || !ideal) {
            return 'card-laranja';
        }

        const diff = Math.abs(humidade - ideal);
        if (diff <= 5) {
            return 'card-verde';
        } else if (diff <= 10) {
            return 'card-amarelo';
        } else {
            return 'card-laranja';
        }
    }

}
