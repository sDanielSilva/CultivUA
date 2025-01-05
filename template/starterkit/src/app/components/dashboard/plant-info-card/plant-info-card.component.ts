import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-plant-info-card',
  templateUrl: './plant-info-card.component.html',
  styleUrls: ['./plant-info-card.component.scss'],
  standalone: true,
  imports: [
    MatIconModule
  ],
})
export class PlantInfoCardComponent {
  plant = {
    name: 'Strawberry Plant',
    type: 'Outdoor / Indoor Plant',
    humidity: 72,
    water: 3.4,
    temperature: '18-22°C',
  };
}
