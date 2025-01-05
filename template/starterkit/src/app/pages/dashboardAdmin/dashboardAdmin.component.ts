import { Component, LOCALE_ID, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';  // A importar a localidade pt-PT
import { jsPDF } from 'jspdf'; // A importar a biblioteca jsPDF
import html2canvas from 'html2canvas'; // A importar a biblioteca html2canvas

import { AppDoughnutpieChartAdminComponent } from 'src/app/components/doughnut-pieAdmin/doughnut-pieAdmin.component';
import { AppLineChartComponent } from 'src/app/components/line/line.component';
import { AppRadialRadarChartComponent } from 'src/app/components/radial-radar/radial-radar.component';
import { AppTopCardsComponent } from 'src/app/components/top-cards/top-cards.component';
import { MaterialModule } from 'src/app/material.module';
import { LineChartComponent2} from 'src/app/components/line2/line.component';

// Registrando a localidade pt-PT
registerLocaleData(pt);

@Component({
  selector: 'app-dashboardAdmin',
  templateUrl: './dashboardAdmin.component.html',
  standalone: true,
  imports: [MaterialModule, AppTopCardsComponent, AppLineChartComponent, AppRadialRadarChartComponent, AppDoughnutpieChartAdminComponent, LineChartComponent2],
  styleUrls: ['./dashboardAdmin.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pt-PT' } // Definindo pt-PT como o idioma padrão
  ],
})
export class DashboardAdminComponent {
  currentDate: string = '';
  adminName: string | null = '';

  @ViewChild('contentToExport') contentToExport: ElementRef | undefined;

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    // Obtendo a data atual formatada
    const today = new Date();
    this.currentDate = this.datePipe.transform(today, 'EEEE, dd MMM yyyy')!;
    this.adminName = sessionStorage.getItem('admin_name');
  }

  // Função para gerar o PDF
  generatePDF(): void {
     const content = this.contentToExport?.nativeElement;

    // Com html2canvas para capturar o conteúdo
    html2canvas(content).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');

      // A criar uma instância do jsPDF para formato A5
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [148, 210], // Define explicitamente o formato A5
      });
      
      // Dimensões da página A5
      const pageWidth = 148; // Largura em mm (A5)
      const pageHeight = 210; // Altura em mm (A5)
      
      // Ajustando a largura e altura da imagem proporcionalmente
      const imgWidth = pageWidth * 0.9; // Reduzimos a largura para caber dentro da página com margem
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Calculando margens para centralização
      const xOffset = (pageWidth - imgWidth) / 2; // Centraliza horizontalmente
      const yOffset = (pageHeight - imgHeight) / 2; // Centraliza verticalmente
      
      // Verificando se o conteúdo ultrapassa a altura de uma página
      if (imgHeight <= pageHeight) {
        // Se o conteúdo cabe em uma página, centraliza na primeira página
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      } else {
        // Se for maior, divide o conteúdo em várias páginas
        const totalPages = Math.ceil(imgHeight / pageHeight);
      
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage();
          }
      
          // Calcula a posição da imagem para cada página
          const adjustedYOffset = yOffset - i * pageHeight;
      
          pdf.addImage(
            imgData,
            'PNG',
            xOffset,
            adjustedYOffset,
            imgWidth,
            imgHeight
          );
        }
      }
      
      // Guarda o PDF
      pdf.save('relatorio_dashboard.pdf');
    });
  }
}