import { Component, Output, EventEmitter, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewportScroller } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { TablerIconsModule } from "angular-tabler-icons";
import { RouterLink } from "@angular/router";
import { Router } from "@angular/router";
import { PlantService, Plant } from "src/app/services/plant.service";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ToastService } from "src/app/services/shared/toast.service";

@Component({
    selector: "app-addplant",
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        TablerIconsModule,
        RouterLink,
        FormsModule,
    ],
    templateUrl: "./addplant.component.html",
    styleUrls: ["./addplant.component.scss"],
})
export class AppaddplantComponent {
    plantName: string = ""; // Stores the name of the searched plant
    searchResults: Plant[] = []; // Stores the search results
    errorMessage: string = ""; // Error message, if any

    constructor(private plantService: PlantService, private toastService: ToastService) {}

    searchPlant() {
        this.errorMessage = "";
        this.searchResults = []; // Clear previous results

        this.plantService.searchPlant(this.plantName).subscribe({
            next: (result) => {
                this.searchResults = result.plants; // Update to 'searchResults'
            },
            error: (err) => {
                this.toastService.show('Error searching for plant!', 'error');
            },
        });
    }

    addToDashboard(plantId: number, plantName: string) {
        this.plantService
            .addPlantToDashboard(plantId, plantName)
            .subscribe(() => {
                this.toastService.show('Plant added successfully!', 'success', 3000);
            });
    }
}
