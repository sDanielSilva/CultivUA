import { LocationService } from '../../../../services/location.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';

interface Location {
  id: number;
  name: string;
  // Add other properties as needed
}
import { PageEvent } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconComponent, TablerIconsModule } from 'angular-tabler-icons';
import { AddLocationDialogComponent } from 'src/app/components/modalLocalizacoes/modalLocalizacoes.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogLocalComponent } from 'src/app/components/modalLocalizacoes/modalDelete.component ';
import { ModalEditLocationComponent } from 'src/app/components/modalLocalizacoes/modalEditLocalizacoes/modalEditLocalizacoes.component';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-list-locations',
  templateUrl: './list-locations.component.html',
    standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TablerIconsModule,
    ConfirmDialogLocalComponent,
    ModalEditLocationComponent,
  ],
})
export class ListLocationsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  locations: MatTableDataSource<Location> = new MatTableDataSource<Location>();
  totalLocationsCount: number = 0; // Total count of locations
  isLoading: boolean = true;

  pageSize: number = 5; // Initial page size
  pageSizeOptions: number[] = [5, 8, 10]; // Options for the paginator
  currentPageData: Location[] = []; // Data for the current page

  @ViewChild(MatSort) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private locationService: LocationService, private dialog: MatDialog, private toastService: ToastService) {}

  ngAfterViewInit(): void {
    this.locations.sort = this.sort;
    this.locations.paginator = this.paginator;
    this.loadLocations(); // Load locations initially
  }

  loadLocations(): void {
    this.isLoading = true;
    this.locationService.getLocations().subscribe(
      (data) => {
        this.totalLocationsCount = data.length; // Set the total number of locations
        this.currentPageData = data.slice(0, this.pageSize); // Load data for the first page
        this.locations.data = this.currentPageData; // Assign data to the table
        this.isLoading = false;
      },
      (error) => {
        this.toastService.show('Error loading locations', 'error', 3000);
        this.isLoading = false;
      }
    );
  }

  filter(filterValue: string): void {
    // Apply the filter efficiently
    const filteredData = this.currentPageData.filter((location) =>
      location.name.toLowerCase().includes(filterValue.trim().toLowerCase())
    );
    this.locations.data = filteredData;
  }

  deleteLocation(id: number): void {
      this.locationService.deleteLocation(id).subscribe(() => {
        // Update data directly after deletion without reloading everything
        this.locations.data = this.locations.data.filter((loc) => loc.id !== id);
      });

  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize; // Update the page size with the selected value
    const startIndex = event.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Load only the necessary data for the new page
    this.locationService.getLocations().subscribe((data) => {
      this.currentPageData = data.slice(startIndex, endIndex); // Get data for the current page
      this.locations.data = this.currentPageData; // Assign data to the table
    });
  }

  openAddLocationDialog(): void {
    const dialogRef = this.dialog.open(AddLocationDialogComponent);

    // Reload locations after adding a new one
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadLocations();
      }
    });
  }
confirmDelete(id: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogLocalComponent, {
    width: '350px',
  });

  dialogRef.afterClosed().subscribe((confirmed) => {
    if (confirmed) {
      this.deleteLocation(id);
    }
  });
}
openEditModal(location: Location): void {
  const dialogRef = this.dialog.open(ModalEditLocationComponent, {
    width: '400px',
    data: { location }, // Pass the location as data to the modal
  });

  // After closing the modal, reload the list if necessary
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Reload the list or perform other actions
      this.loadLocations();
    }
  });
}
}
