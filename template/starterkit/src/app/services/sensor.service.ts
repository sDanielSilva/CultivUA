import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Sensor } from '../models/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private sensors: Sensor[] = [
    {
      id: '1',
      name: 'Sensor de Humidade',
      type: 'Higrometro',
      humidity: 45,
      light: 200,
      temperature: 22,
    },
    {
      id: '2',
      name: 'Sensor de Luz',
      type: 'Fotômetro',
      humidity: 50,
      light: 500,
      temperature: 23,
    },
  ];

  constructor(private http: HttpClient) {}

  getSensors(): Observable<Sensor[]> {
    // Simulação de uma chamada de API
    return of(this.sensors);
  }

  // Método adicional para procurar um sensor específico por ID (se necessário)
  getSensorById(id: string): Observable<Sensor | undefined> {
    const sensor = this.sensors.find(s => s.id === id);
    return of(sensor);
  }
}