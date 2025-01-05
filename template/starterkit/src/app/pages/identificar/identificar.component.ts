import { Component, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { PlantService } from "../../services/plant.service";
import { MaterialModule } from "../../material.module";
import { CommonModule } from "@angular/common";
import { AuthService } from "src/app/services/auth.service";
import { ToastService } from "src/app/services/shared/toast.service";

@Component({
    selector: "app-identificar",
    templateUrl: "./identificar.component.html",
    styleUrls: ["./identificar.component.scss"],
    imports: [MaterialModule, CommonModule],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
})
export class IdentificarComponent {
    uploadingFile = false;
    plantData: any = null;
    sendGeolocation: boolean = false;
    userCoordinates: { lat: number; lon: number } | null = null;

    constructor(
        private plantService: PlantService,
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        const savedPlantData = sessionStorage.getItem("plantData");
        if (savedPlantData) {
            this.plantData = JSON.parse(savedPlantData);
            sessionStorage.removeItem("plantData");
        }
    }

    toggleGeolocation() {
        this.sendGeolocation = !this.sendGeolocation;
        if (this.sendGeolocation) {
            this.getGeolocation();
        }
    }

    getGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userCoordinates = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    };
                },
                (error) => {
                    let errorMessage = "Error obtaining location.";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            this.toastService.show('Location permission denied', 'error', 3000);
                            break;
                        case error.POSITION_UNAVAILABLE:
                            this.toastService.show('Location unavailable. Check if location service is enabled and if the device has GPS signal.', 'error', 3000);
                            break;
                        case error.TIMEOUT:
                            this.toastService.show('Location request timed out.', 'error', 3000);
                            break;
                        default:
                            this.toastService.show('Unknown error obtaining location.', 'error', 3000);
                            break;
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            this.toastService.show('Geolocation not supported in this browser.', 'warning', 3000);
        }
    }

    triggerFileInput() {
        const fileInput: HTMLInputElement | null =
            document.querySelector('input[type="file"]');
        fileInput?.click();
    }

    onFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.uploadFile(file);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            this.uploadFile(file);
        }
    }

    uploadFile(file: File) {
        this.uploadingFile = true;
        this.plantService.identifyPlant(file, this.userCoordinates).subscribe({
            next: (response: any) => {
                this.uploadingFile = false;
                this.processPlantData(response);
            },
            error: (err) => {
                this.toastService.show('Upload error', 'error', 3000);
                this.uploadingFile = false;
            },
        });
    }

    processPlantData(response: any) {
        const plantIdResponse = response.plant_id_response;
        const perenualResponse = response.perenual_response;

        let bestMatch = null;

        if (
            plantIdResponse &&
            plantIdResponse.result &&
            plantIdResponse.result.classification
        ) {
            bestMatch = plantIdResponse.result.classification.suggestions[0];
        }

        let bestPerenualMatch = null;
        if (
            perenualResponse &&
            perenualResponse.data &&
            perenualResponse.data.length > 0
        ) {
            bestPerenualMatch = perenualResponse.data[0];
        }

        if (bestMatch) {
            this.plantData = {
                name: bestMatch.name,
                probability: bestMatch.probability,
                image: plantIdResponse.input.images[0],
                plantId: bestPerenualMatch ? bestPerenualMatch.id : null, // Ensure plantId is not null
                perenualInfo: bestPerenualMatch
                    ? {
                          common_name: bestPerenualMatch.common_name,
                          cycle: bestPerenualMatch.cycle,
                          watering: bestPerenualMatch.watering,
                          sunlight: bestPerenualMatch.sunlight,
                          description: bestPerenualMatch.description,
                      }
                    : null,
            };
        } else {
            this.toastService.show('Could not correctly identify the plant.', 'error', 3000);
        }
    }

    goToStore() {
        this.router.navigate(["/loja-online"], {
            queryParams: { plant: this.plantData.name },
        });
    }

    addToDashboard() {
        this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            if (!isAuthenticated) {
                // Save plant state in sessionStorage
                if (this.plantData) {
                    sessionStorage.setItem(
                        "plantData",
                        JSON.stringify(this.plantData)
                    );
                }

                // Save current URL for redirect after login
                this.authService.setRedirectUrl(this.router.url);

                // Redirect to login page
                this.toastService.show('You need to log in to add to the dashboard.', 'warning', 3000);
                this.router.navigate(["/login"]);
            } else {
                // Add plant to dashboard
                if (this.plantData?.plantId && this.plantData?.name) {
                    this.plantService
                        .addPlantToDashboard(
                            this.plantData.plantId,
                            this.plantData.name
                        )
                        .subscribe({
                            next: () => {
                                this.toastService.show(`${this.plantData.name} successfully added to your dashboard!`, 'success', 3000);
                            },                            
                            error: (err) => {
                                this.toastService.show(`Error adding the plant to your dashboard!`, 'error', 3000);
                            },
                        });
                } else {
                    this.toastService.show(`Incomplete plant data. Cannot add to dashboard.`, 'error', 3000);
                }
            }
        });
    }
}
