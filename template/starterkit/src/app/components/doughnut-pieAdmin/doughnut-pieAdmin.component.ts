import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { AdminDashboardService } from 'src/app/services/dashboard-admin.service';
import { ToastService } from 'src/app/services/shared/toast.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-doughnut-pieAdmin',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './doughnut-pieAdmin.component.html',
})
export class AppDoughnutpieChartAdminComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public doughnutChartOptions: Partial<ChartOptions> | any;

  constructor(private AdminDashboardService: AdminDashboardService, private toastService: ToastService) {}

  ngOnInit(): void {
    // Inicializa o gráfico vazio
    this.doughnutChartOptions = {
      series: [],
      chart: {
        id: 'donut-chart',
        type: 'donut',
        height: 350,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: '#adb0bb',
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(0)}%`,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70px',
          },
        },
      },
      legend: {
        show: true,
        position: 'bottom',
        width: '50px',
      },
      colors: [],
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
        y: {
          formatter: (val: number) => `${val.toFixed(0)}`,
        },
      },
      labels: [],
    };

    // Carrega os dados do gráfico
    this.loadChartData();
  }

  loadChartData(): void {
    this.AdminDashboardService.getProductsSoldByCategory().subscribe(
      (data) => {
        // Preenche os dados no gráfico
        this.doughnutChartOptions.series = data.map(
          (item: any) => +item.total_sold
        );

        this.doughnutChartOptions.labels = data.map(
          (item: any) => item.category
        );

        // Gera cores dinâmicas para cada categoria
        this.doughnutChartOptions.colors = this.generateGreenShades(
          this.doughnutChartOptions.series.length
        );
      },
      (error) => {
        this.toastService.show('An error occurred while loading the data!', 'error');
      }
    );
  }

  /**
   * Gera tons de verde com base na quantidade de categorias.
   * @param count Número de categorias
   * @returns Lista de cores em formato HSL
   */
  private generateGreenShades(count: number): string[] {
    const colors: string[] = [];
    const baseHue = 120; // Cor verde no HSL
    const saturation = 70; // Saturação fixa
    const minLightness = 30; // Luminosidade mínima
    const maxLightness = 70; // Luminosidade máxima

    for (let i = 0; i < count; i++) {
      const lightness =
        minLightness + ((maxLightness - minLightness) / count) * i;
      colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }
}