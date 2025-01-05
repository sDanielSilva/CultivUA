import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';

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
  selector: 'app-line',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, CommonModule],
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class AppLineChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public lineChartOptions: Partial<ChartOptions> | any;
  public months: { name: string; value: number }[] = [];
  public selectedMonth: number = 0; // Valor numérico do mês selecionado
  private monthlySalesData: { [key: number]: any[] } = {}; // Dados mensais por índice de mês

  constructor(
    private adminDashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef // Injetando ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeChart();
    this.fetchMonthlySales();
  }

  ngAfterViewInit() {
    // Garante que o gráfico seja renderizado após a inicialização da view
    this.cdr.detectChanges();
  }

  initializeChart() {
    this.lineChartOptions = {
      series: [{ name: 'Sales', data: [] }],
      chart: {
        height: 300,
        type: 'area',
        fontFamily: 'DM Sans, sans-serif',
        foreColor: '#a1aab2',
        toolbar: { show: false },
      },
      xaxis: { type: 'category', categories: [] },
      yaxis: { min: 0 },
      tooltip: { theme: 'dark' },
      grid: { show: true, borderColor: 'rgba(0,0,0,0.1)' },
      fill: {
        type: 'solid',
        gradient: {
          shade: 'light',
          type: 'vertical',
          opacityFrom: 1,
          opacityTo: 0,
          gradientToColors: ['#04301C'],
          stops: [0, 100],
        },
      },
      stroke: {
        curve: 'straight',
        width: 2,
        colors: ['#009A3E'],
      },
      colors: ['#009A3E', '#04301C'],
    };
  }

  fetchMonthlySales() {
    this.adminDashboardService.getMonthlySales().subscribe((data: any) => {
      this.monthlySalesData = data;
  
      this.months = Object.keys(data).map((month) => ({
        name: this.getMonthName(+month),
        value: +month,
      }));
  
      this.selectedMonth = Math.max(...Object.keys(data).map((month) => +month));
      this.updateChart(data[this.selectedMonth]);
    });
  }

  updateChart(monthData: any) {
    const totalDays = new Date(new Date().getFullYear(), this.selectedMonth, 0).getDate(); // Total de dias no mês
    const salesByDay = Array(totalDays).fill(0); // Inicializa com 0 vendas para todos os dias

    monthData.forEach((day: any) => {
      salesByDay[day.day - 1] = day.total_sales; // Preenche vendas no índice correto
    });

    // Atualiza as opções do gráfico com novos dados
    this.lineChartOptions = {
      ...this.lineChartOptions,
      series: [{ name: 'Sales', data: salesByDay }],
      xaxis: {
        ...this.lineChartOptions.xaxis,
        categories: Array.from({ length: totalDays }, (_, i) => i + 1),
      },
    };

    // Força a renderização do gráfico após a atualização dos dados
    if (this.chart) {
      this.chart.updateOptions(this.lineChartOptions, true); // Atualiza as opções e força a renderização
      this.cdr.detectChanges(); // Força a detecção de mudanças
    }
  }

  onMonthChange(selectedMonth: number) {
    const monthData = this.monthlySalesData[selectedMonth] || [];
    this.updateChart(monthData);
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[monthIndex - 1];
  }
}
