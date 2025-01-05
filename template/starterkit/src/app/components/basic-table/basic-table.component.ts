import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LocationService } from '../../services/location.service';

export interface LocationData {
  id: number;
  name: string;
}

@Component({
  standalone: true, // Define o componente como standalone
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatTableModule,
  ],
})
export class AppBasicTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = new MatTableDataSource<LocationData>([]); // Com MatTableDataSource

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.fetchLocations();
  }

  fetchLocations(): void {
    this.locationService.getLocations().subscribe(
      (data: LocationData[]) => {
        this.dataSource.data = data; // Atualizando o dataSource
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  editLocation(id: number): void {
    console.log(`Edit location with ID: ${id}`);
  }

  deleteLocation(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.locationService.deleteLocation(id).subscribe(
        () => {
          // Atualize os dados removendo o item do array de dados
          this.dataSource.data = this.dataSource.data.filter(location => location.id !== id);
        },
        (error) => {
            console.error('Error deleting location:', error);
        }
      );
    }
  }  
}
