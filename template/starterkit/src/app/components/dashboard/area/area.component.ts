import { Component, Input, ViewChild } from '@angular/core';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexGrid, ApexStroke, ApexTooltip, ApexDataLabels, ApexLegend } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="areaChartOptions.series || []"
      [chart]="areaChartOptions.chart || { type: 'area', height: 300 }"
      [xaxis]="areaChartOptions.xaxis || { categories: [] }"
      [yaxis]="areaChartOptions.yaxis || { title: { text: '' } }"
      [grid]="areaChartOptions.grid || { show: true }"
      [stroke]="areaChartOptions.stroke || { curve: 'smooth', width: 2 }"
      [tooltip]="areaChartOptions.tooltip || { theme: 'dark' }"
      [dataLabels]="areaChartOptions.dataLabels || { enabled: false }"
      [legend]="areaChartOptions.legend || { position: 'top' }"
      [colors]="areaChartOptions.colors || ['#398bf7', '#06d79c']"
    ></apx-chart>
  `,
})
export class AppAreaChartComponent {
  @ViewChild('chart') chart: ChartComponent | undefined;

  @Input() areaChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'area', height: 300 },
    xaxis: { categories: [] },
    yaxis: { title: { text: '' } },
    stroke: { curve: 'smooth', width: 2 },
    grid: { show: true },
    tooltip: { theme: 'dark' },
    dataLabels: { enabled: false },
    legend: { position: 'top' },
    colors: ['#398bf7', '#06d79c'],
  };
}
