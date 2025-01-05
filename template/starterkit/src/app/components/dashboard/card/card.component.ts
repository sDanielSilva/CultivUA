import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlantInfoCardComponent } from '../plant-info-card/plant-info-card.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [PlantInfoCardComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  constructor(private router: Router) {}

  // Função que navega para a página de adicionar uma nova planta
  goToAddPlant() {
    this.router.navigate(['/addplant']);
  }
}
