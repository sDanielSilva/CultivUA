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
 /* formatter: (val: number) => {
                return val;
              } */
export type ChartOptions = {
  series: number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: string[];
  colors: string[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-radial-radar',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './radial-radar.component.html',
})
export class AppRadialRadarChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public radialbarChartOptions: Partial<ChartOptions> | any;

  constructor(private AdminDashboardService: AdminDashboardService, private toastService: ToastService) {}

  ngOnInit(): void {
    // Inicializa o gráfico vazio
    this.radialbarChartOptions = {
      series: [],
      chart: {
        id: 'radial-chart',
        type: 'radialBar',
        height: 350,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
      },
      colors: [],
      plotOptions: {
        radialBar: {
          size: undefined, // Permita que o gráfico ajuste dinamicamente o tamanho
          hollow: {
            size: '25%', // Ajuste o tamanho do centro oco
          },
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
              formatter: (val: number) => `${Math.round(val)}%`, // Mostra a percentagem
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => {
                // Mostra o total de vendas correto
                return this.radialbarChartOptions.totalSales;
              },
            },
          },
        },
      },
      labels: [],
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: any, opts: any) => {
            const index = opts.seriesIndex;
            const totalSold = this.radialbarChartOptions.rawData[index].total_sold;
            return `${totalSold} sales`;
          }, 
        },
      },
    };

    // Procura os dados da API
    this.loadChartData();
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

  loadChartData(): void {
    this.AdminDashboardService.getProductsSoldByCategory().subscribe(
      (data) => {
        // Calcula o total de vendas
        const totalSales = data.reduce((sum: number, item: any) => sum + +item.total_sold, 0);
        this.radialbarChartOptions.totalSales = totalSales;

        this.radialbarChartOptions.rawData = data;

        // Calcula a percentagem de cada categoria
        this.radialbarChartOptions.series = data.map((item: any) =>
          ((+item.total_sold / totalSales) * 100).toFixed(1)
        );

        // Define os rótulos
        this.radialbarChartOptions.labels = data.map((item: any) => item.category);

        // Gera cores dinâmicas para cada categoria
        this.radialbarChartOptions.colors = this.generateGreenShades(
          this.radialbarChartOptions.series.length
        );
      },
      (error) => {
        this.toastService.show('Error loading data', 'error', 3000);
      }
    );
  }

};
