import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlantInformacaoService } from '../../services/plantinformacao.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/shared/toast.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-planta-info',
  templateUrl: './planta-info.component.html',
  styleUrls: ['./planta-info.component.css'],
  imports: [MaterialModule, CommonModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class PlantaInfo implements OnInit {
  plantId: string | null = null;
  userPlantId: string | null = null;  // Adicionando a declaração de userPlantId
  plantData: any = null;
  constructor(private route: ActivatedRoute, private plantService: PlantInformacaoService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.plantId = this.route.snapshot.paramMap.get('id');
    
    this.userPlantId = this.route.snapshot.queryParamMap.get('user_plant_id');
  
    if (this.plantId) {
      this.plantService.getPlantById(this.plantId).subscribe(
        (data) => {
          this.plantData = data;
        },
        (error) => {
            this.toastService.show('Error loading plant data:', 'error', 3000);
        }
      );
    }
  }

  // Função chamada quando o user altera a imagem
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    // Verificar se o user selecionou um arquivo
    if (input.files && input.files.length > 0 && this.userPlantId) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = reader.result as string;

        // Envia a base64 para o backend com o user_plant_id correto
        this.plantService.updatePlantImage(this.userPlantId, base64Image).subscribe(
          () => {
            this.toastService.show('Image updated successfully!', 'success', 3000);
          },
          (error) => {
            this.toastService.show('Error updating image', 'error', 3000);
          }
        );
      };

      reader.readAsDataURL(file); // Lê o arquivo como base64
    } else {
      this.toastService.show('No image selected or user_plant_id not found', 'error', 3000);
    }
  }
  
  // Método para obter tooltip da estação de colheita
  getHarvestTooltip(season: string): string {
    const months: { [key: string]: string } = {
      Spring: 'March - May',
      Summer: 'June - August',
      Fall: 'September - November',
      Winter: 'December - February',
    };
    return months[season] || 'Months not defined';
  }

  // Método para traduzir a estação para português
  getSeasonInPortuguese(season: string): string {
    const seasons: { [key: string]: string } = {
      Spring: 'Spring',
      Summer: 'Summer',
      Fall: 'Fall',
      Winter: 'Winter',
    };
    return seasons[season] || 'Not specified';
  }

  // Método de edição da planta
  editPlant(): void {
    console.log('Edit plant:', this.plantId);
  }

  // Método para gerar o PDF com os dados da planta
  generatePDF(): void {
    const doc = new jsPDF();

    // Adicionar título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Plant Report', 14, 20);

    // Adicionar a imagem capturada via html2canvas
    if (this.plantData.image) {
      html2canvas(document.querySelector('#plant-image')!).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/jpeg');
        doc.addImage(imgData, 'JPEG', 14, 30, 60, 60); // Inserir imagem com a largura e altura desejada

        // Após adicionar a imagem, adicionamos os detalhes da planta
        this.addPlantDetailsToPDF(doc);

        // Gerar o PDF
        doc.save('plant_report.pdf');
      });
    } else {
      // Caso não haja imagem, apenas adiciona os detalhes da planta
      this.addPlantDetailsToPDF(doc);
      doc.save('plant_report.pdf');
    }
  }

  // Função auxiliar para adicionar os detalhes da planta no PDF
  addPlantDetailsToPDF(doc: jsPDF): void {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Dados simples (nome, espécie, etc.)
    doc.text(`Name: ${this.plantData.name}`, 14, 100);
    doc.text(`Species: ${this.plantData.species || 'Unknown species'}`, 14, 110);
    doc.text(`Harvest Season: ${this.getSeasonInPortuguese(this.plantData.harvest_season)}`, 14, 120);
    doc.text(`Ideal Temperature: ${this.plantData.ideal_temperature}°C`, 14, 130);
    doc.text(`Ideal Humidity: ${this.plantData.ideal_humidity}%`, 14, 140);
    doc.text(`Ideal Sunlight: ${this.plantData.sunlight}`, 14, 150);
    doc.text(`Watering Frequency: ${this.plantData.watering_frequency} days`, 14, 160);

    // Adicionar a descrição (com corte e justificação)
    const description = this.plantData.description || 'Description not found';
    doc.text(description, 14, 170, {
      maxWidth: 180, // Limitar a largura do texto
      align: 'justify', // Justificar o texto
    });
  }
}
