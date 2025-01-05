import { Component, ViewChild, Input } from '@angular/core';
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
import { MaterialModule } from '../../../material.module';

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
  labels?: string[];
};

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './line.component.html',
})
export class AppLineChartComponent {
  @Input() lineChartOptions: Partial<ChartOptions> = {}; // Inicializa com objeto vazio para evitar undefined

  @ViewChild('chart', { static: true }) chart: ChartComponent | undefined;

  // Valores padrão para o gráfico
  public defaultOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'line',
      height: 400,
      width: '100%',
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: { text: 'Values' },
    },
    stroke: {
      curve: 'smooth',
    },
    colors: ['#FF5733', '#33C3FF', '#33FF57'],
    legend: {
      position: 'top',
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  // Função para combinar opções
  public get mergedOptions(): Partial<ChartOptions> {
    return { ...this.defaultOptions, ...this.lineChartOptions };
  }
}
