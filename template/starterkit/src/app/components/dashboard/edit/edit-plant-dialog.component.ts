import { Component, Inject, OnInit } from "@angular/core";
import { LocationService } from "src/app/services/location.service"; // Add this import
import { HttpClient } from "@angular/common/http"; // Add this import
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog"; // Missing import for dialog components
import { MatButtonModule } from "@angular/material/button"; // Missing import for button components
import { CommonModule } from "@angular/common";
import { PlantService } from "src/app/services/plant.service";
import { ToastService } from "src/app/services/shared/toast.service";
@Component({
    selector: "app-edit-plant-dialog",
    templateUrl: "./edit-plant-dialog.component.html",
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule, // Add MatDialogModule here
        MatButtonModule,
        CommonModule,
    ],
    standalone: true,
})
export class EditPlantDialogComponent implements OnInit {
    locations: any[] = []; // Para armazenar os dados de localizações
    image: string = this.data.plant.image || "";
    name: string = this.data.plant.name || "";
    locationId: string = ""; // Inicializado como string vazia
    userPlantId: string = this.data.user_plant_id;
    usersId: string = this.data.plant.userId;
    plantsId: string = this.data.plant.plantId;

    constructor(
        public dialogRef: MatDialogRef<EditPlantDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private locationService: LocationService,
        private plantService: PlantService,
        private http: HttpClient,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.getLocations();
    }

    getLocations(): void {
        this.locationService.getLocations().subscribe(
            (locations) => {
                this.locations = locations;
                // Atribuindo o locationId da planta à variável locationId após as localizações serem carregadas
                this.locationId = this.data.plant.locationId || "";
            },
            (error) => {
                this.toastService.show('Error loading locations!', 'error');
            }
        );
    }

    onImageChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.image = reader.result as string; // A imagem em Base64
            };
            reader.readAsDataURL(file); // Lê o arquivo como DataURL (Base64)
        }
    }

    onSave(): void {
        const plantData = {
            user_plant_id: this.data.user_plant_id,
            location_id: this.locationId,
            name: this.name,
            image: this.image,
        };

        // Passando o ID necessário como segundo argumento
        const plantId = this.data.user_plant_id;

        this.plantService.savePlant(plantData, plantId).subscribe(
            (response) => {
                this.dialogRef.close(response); // Fecha o modal e retorna os dados salvos
                window.location.reload();
            },
            (error) => {
                this.toastService.show('Error saving!', 'error');
            }
        );
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
