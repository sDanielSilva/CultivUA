// src/app/models/sensor.model.ts
export interface Sensor {
  id: string;
  name: string;
  type: string;
  humidity: number; // Exemplo: 45 (percentual)
  light: number;    // Exemplo: 200 (lux)
  temperature: number; // Exemplo: 22 (graus Celsius)
}
