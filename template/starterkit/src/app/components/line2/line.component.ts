import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'material.module';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexXAxis, ApexYAxis, ApexLegend, ApexTooltip, ApexTheme, ApexGrid, ApexStroke, ApexMarkers, ApexDataLabels, ApexFill, NgApexchartsModule } from 'ng-apexcharts';
import { AdminDashboardService } from 'src/app/services/dashboard-admin.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  fill: ApexFill;
};

@Component({
  selector: 'app-line2',
  standalone: true,
  templateUrl: './line.component.html',
  imports: [NgApexchartsModule, MaterialModule, CommonModule],
})
export class LineChartComponent2 implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public lineChartOptions: Partial<ChartOptions> | any;

  constructor(private AdminDashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.AdminDashboardService.getPlantDataByDay().subscribe(
      (data) => {
        this.updateChartData(data);
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }
  
  
  updateChartData(data: any[]) {
    // Extrair os dados de dias e totais acumulativos
    const days = data.map((item) => item.day); // Array de dias
    const cumulativeTotal = data.map((item) => item.cumulative_total); // Array de totais acumulativos
  
    // Configurar as opções do gráfico
    this.lineChartOptions = {
      series: [
        {
          name: 'Total Plants',
          data: cumulativeTotal, // Usar cumulative_total diretamente
        },
      ],
      chart: {
        height: 300,
        type: 'line',
        fontFamily: 'DM Sans,sans-serif',
        foreColor: '#a1aab2',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 3,
        strokeColors: 'transparent',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      colors: ['#06d79c'],
      legend: {
        show: true,
      },
      grid: {
        show: true,
        borderColor: 'rgba(0,0,0,0.1)',
      },
      xaxis: {
        categories: days, // Usar os dias para o eixo X
        type: 'category',
      },
      tooltip: {
        theme: 'dark',
      },
    };
  }
}