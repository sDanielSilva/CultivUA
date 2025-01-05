import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { DashboardPlantService } from "../../../services/dashboardplant.service";
import { AuthService } from "../../../services/auth.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/material.module";
import { RouterModule } from "@angular/router";
import * as bootstrap from "bootstrap";
import { Router } from "@angular/router";
import { UsersPlantsService } from "../../../services/users-plants.service";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { EditPlantDialogComponent } from "../edit/edit-plant-dialog.component";
import { Observable, forkJoin as rxjsForkJoin } from "rxjs";
import { LocationService } from "../../../services/location.service";
import { TablerIconsModule } from "angular-tabler-icons";
import { KitReadingService } from "src/app/services/kit-reading.service";
import { ToastService } from "src/app/services/shared/toast.service";

@Component({
    selector: "app-plant-list",
    templateUrl: "./plant-list.component.html",
    styleUrls: ["./plant-list.component.scss"],
    imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        FormsModule,
        MaterialModule,
        RouterModule,
        EditPlantDialogComponent,
        TablerIconsModule,
    ],
    standalone: true,
})
export class PlantListComponent implements OnInit {
    plants: any[] = [];
    location: string = "";
    kitData: any[] = [];
    locations: { id: number; name: string }[] = [];
    selectedPlant: any = null;
    kit: any = { codigo: '', name: '' };
    isEditMode: boolean = false;

    filters = {
        hasKit: "",
        season: "",
        searchTerm: "",
        locationId: "",
    };

    showFullDescriptionMap: { [key: number]: boolean } = {};
    cdr: any;

    constructor(
        private plantService: DashboardPlantService,
        private authService: AuthService,
        private router: Router,
        private usersPlantsService: UsersPlantsService,
        private dialog: MatDialog,
        private locationService: LocationService,
        private kitReadingService: KitReadingService,
        private toastService: ToastService

    ) { }

    openEditDialog(plant: any): void {
        const dialogRef = this.dialog.open(EditPlantDialogComponent, {
            data: {
                plant: plant,
                locations: this.locations,
                user_plant_id: plant.user_plant_id,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                plant.image = result.image;
                plant.name = result.name;
                plant.locationId = result.locationId;
            }
        });
    }

    ngOnInit(): void {
        const userId = this.authService.getUserId();
        if (userId) {
            this.loadLocations();
            this.loadUserPlants(userId);
        } else {
            this.toastService.show('User not authenticated!', 'error');
        }
    }

    loadLocations(): void {
        this.locationService.getLocations().subscribe(
            (locationsData) => {
                this.locations = locationsData;
            },
            (error) => {
                this.toastService.show('Error loading locations!', 'error');
            }
        );
    }

    loadUserPlants(userId: string): void {
        this.plantService.getUserPlantsWithKits(userId).subscribe(
            (plantsData) => {
                console.log('Plants Data:', plantsData); // Log dos dados recebidos
                this.plants = plantsData;
                this.updatePlantData();
            },
            (error) => {
                this.toastService.show('Error loading plants!', 'error');
            }
        );
    }    


    updatePlantData(): void {
        this.plants.forEach((plant) => {
            const userPlant$ = this.plantService.getUserPlantsTable(
                plant.user_plant_id
            );
            const location$ = this.plantService.getLocationsByUserId(plant.id);

            let observables = [userPlant$, location$];

            // Se a planta tiver um kit associado, procurar as leituras
            if (plant.kit_id) {
                const kitReadings$ = this.kitReadingService.getReadingsByKitId(plant.kit_id);
                observables.push(kitReadings$);
            }

            forkJoin(observables).subscribe(
                ([userPlantData, locationData, kitReadingsData]) => {
                    if (userPlantData?.user_plant) {
                        plant.name =
                            userPlantData.user_plant.name || plant.name;
                        plant.image =
                            userPlantData.user_plant.image || plant.image;
                    }

                    plant.location = locationData?.location || null;

                    // Adiciona as leituras do kit apenas se disponíveis
                    if (plant.kit_id && kitReadingsData) {
                        plant.kitReadings = kitReadingsData;
                    }
                },
                (error) => {
                    this.toastService.show('Error loading plant data!', 'error');
                }
            );
        });
    }

    filteredPlants() {
        return this.plants.filter((plant) => {
            const matchesKit =
                this.filters.hasKit === "" ||
                (this.filters.hasKit === "true" && plant.kit_name) ||
                (this.filters.hasKit === "false" && !plant.kit_name);

            const matchesSeason =
                this.filters.season === "" ||
                plant.harvest_season === this.filters.season;

            const matchesSearchTerm =
                this.filters.searchTerm === "" ||
                plant.name
                    .toLowerCase()
                    .includes(this.filters.searchTerm.toLowerCase());

            const matchesLocation =
                !this.filters.locationId ||
                plant.location?.id === Number(this.filters.locationId);

            return (
                matchesKit &&
                matchesSeason &&
                matchesSearchTerm &&
                matchesLocation
            );
        });
    }

    toggleDescription(plantId: number) {
        this.showFullDescriptionMap[plantId] =
            !this.showFullDescriptionMap[plantId];
    }

    getHarvestTooltip(season: string): string {
        const harvestInfo: { [key: string]: string } = {
            Summer: "June - August",
            Spring: "March - May",
            Fall: "September - November",
            Winter: "December - February",
        };
        return harvestInfo[season] || "Harvest information not available";
    }

    getSeasonInPortuguese(season: string): string {
        const seasonsInPortuguese: { [key: string]: string } = {
            Winter: "Winter",
            Spring: "Spring",
            Summer: "Summer",
            Fall: "Fall",
        };
        return seasonsInPortuguese[season] || season;
    }

    toggleKitForm(plant: any, isEdit: boolean): void {
        if (this.selectedPlant === plant) {
            // Se o formulário já estiver aberto, retraí-lo
            this.selectedPlant = null;
            this.isEditMode = false;
            this.kit = { codigo: '', name: '' }; // Resetar dados do formulário
        } else {
            // Se o formulário não estiver aberto, abrir com os dados da planta
            this.selectedPlant = plant;
            this.isEditMode = isEdit;
            if (isEdit) {
                // Preencher automaticamente com os dados da planta
                this.kit = {
                    codigo: plant.kit_codigo || '',
                    name: plant.kit_name || '',
                };
            } else {
                // Limpar dados para adicionar um novo kit
                this.kit = { codigo: '', name: '' };
            }
        }
    }

    submitKitForm() {
        // Verifica se cada campo está vazio e mostra uma mensagem de erro específica
        if (!this.kit.codigo) {
            this.toastService.show('The Kit Code field is required!', 'warning');
            return;
        }
        if (!this.kit.name) {
            this.toastService.show('The Kit Name field is required!', 'warning');
            return;
        }

        // Caso a planta não tenha kit associado (verificado pelo campo kit_codigo)
        if (!this.selectedPlant.kit_codigo) {
            // Associa o novo kit diretamente
            this.plantService.associateKit(this.selectedPlant.id, this.kit).subscribe({
                next: (response) => {
                    this.toastService.show('Kit successfully associated!', 'success');
                    const userId = this.authService.getUserId(); // Get the userId from the authentication service
                    if (userId) {
                        this.loadUserPlants(userId); // Update the user's plant list
                    } else {
                        this.toastService.show('Error: user not authenticated!', 'error');
                    }
                    this.kit = { codigo: "", name: "" }; // Clear the form
                    this.cdr.detectChanges(); // Force page refresh
                },
                error: (error) => {
                    this.toastService.show('Error associating the kit!', 'error');
                },
            });
            return;
        }

        // Caso a planta já tenha um kit associado e o código não tenha mudado
        if (this.isEditMode && this.kit.codigo === this.selectedPlant.kit_codigo) {
            this.plantService.updateKitName(this.selectedPlant.id, this.kit.name).subscribe({
                next: (response) => {
                    this.toastService.show('Kit name updated successfully!', 'success');
                    const userId = this.authService.getUserId();
                    if (userId) {
                        this.loadUserPlants(userId);
                    } else {
                        this.toastService.show('User not authenticated!', 'error');
                    }
                    this.kit = { codigo: "", name: "" };
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    this.toastService.show('Error updating kit name!', 'error');
                },
            });
            return;
        }

        // Caso o código do kit tenha mudado, verificamos a disponibilidade do novo código
        this.plantService.checkKitCodeAvailability(this.kit.codigo).subscribe({
            next: (response) => {
                if (!response.available) {
                    this.toastService.show('The new kit code is already in use. Please choose another code.', 'warning');
                    return;
                }

                // Remove o kit antigo e associa o novo
                this.plantService.removeKit(this.selectedPlant.user_plant_id).subscribe({
                    next: () => {
                        this.plantService.associateKit(this.selectedPlant.id, this.kit).subscribe({
                            next: (response) => {
                                this.toastService.show('Kit successfully updated!', 'success');
                                const userId = this.authService.getUserId();
                                if (userId) {
                                    this.loadUserPlants(userId);
                                } else {
                                    this.toastService.show('User not authenticated!', 'error');
                                }
                                this.kit = { codigo: "", name: "" };
                                this.cdr.detectChanges();
                            },
                            error: (error) => {
                                this.toastService.show('Error associating new kit!', 'error');
                            },
                        });
                    },
                    error: (error) => {
                        this.toastService.show('Error removing the kit!', 'error');
                    },
                });
            },
            error: (error) => {
                this.toastService.show('Error checking kit code availability!', 'error');
            },
        });
    }


    removeKit() {
        if (this.selectedPlant) {
            const userPlantId = this.selectedPlant.user_plant_id;
            this.plantService.removeKit(userPlantId).subscribe({
                next: (response) => {
                    this.toastService.show('Kit successfully removed!', 'success');
                    const userId = this.authService.getUserId(); // Get the userId from the authentication service
                    if (userId) {
                        this.loadUserPlants(userId); // Pass the userId to the method
                    } else {
                        this.toastService.show('User not authenticated!', 'error');
                    }
                    this.selectedPlant.kit_name = ''; // Clear the selected plant
                    this.isEditMode = false; // Disable edit mode
                    this.cdr.detectChanges();  // Force page refresh
                },
                error: (error) => {
                    this.toastService.show('An error occurred while removing the kit!', 'warning');
                },
            });
        }
    }


    selectPlant(plant: any): void {
        this.selectedPlant = plant;
        this.kit = { codigo: "", name: "" };
    }

    viewKitDetails(plant: any): void {
        this.plantService.getPlantDetails(plant.id).subscribe({
            next: (data) => {
                

                // Adicionar o `user_plant_id` se estiver disponível
                const kitDataWithUserPlantId = {
                    ...data,
                    user_plant_id: plant.user_plant_id, // Aqui verifica-se se está disponível
                };

                sessionStorage.setItem("kitData", JSON.stringify(kitDataWithUserPlantId));

                this.router.navigate([`/kits-planta/${plant.id}`]);
            },
            error: (error) => {
                this.toastService.show('Error loading plant details!', 'error');
            },
        });
    }


    navigateToAddPlant(): void {
        this.router.navigate(["/addplant"]);
    }

    getTemperatureClass(plant: any): string {
        const temp = plant.kit_id && plant.kitReadings?.length > 0
            ? plant.kitReadings[plant.kitReadings.length - 1].temperatura
            : plant.ideal_temperature;

        if (temp && plant.ideal_temperature) {
            const diff = Math.abs(temp - plant.ideal_temperature);
            if (diff <= 2) {
                return 'green-class'; // Verde
            } else if (diff <= 5) {
                return 'yellow-class'; // Amarelo
            } else {
                return 'orange-class'; // Laranja
            }
        }
        return ''; // Caso não haja valor ideal
    }

    getTemperatureIcon(plant: any): string {
        const temp = plant.kit_id && plant.kitReadings?.length > 0
            ? plant.kitReadings[plant.kitReadings.length - 1].temperatura
            : plant.ideal_temperature;

        if (temp && plant.ideal_temperature) {
            const diff = Math.abs(temp - plant.ideal_temperature);
            if (diff <= 2) {
                return 'check'; // Ícone de sucesso
            } else if (diff <= 5) {
                return 'alert-triangle'; // Alerta
            } else {
                return 'exclamation-circle'; // Ícone de erro
            }
        }
        return ''; // Caso não haja valor ideal
    }

    getLightClass(plant: any): string {
        const light = plant.kit_id && plant.kitReadings?.length > 0
            ? plant.kitReadings[plant.kitReadings.length - 1].luz
            : plant.ideal_light;

        if (light && plant.ideal_light) {
            const diff = Math.abs(light - plant.ideal_light);
            if (diff <= 20) {
                return 'green-class';
            } else if (diff <= 50) {
                return 'yellow-class';
            } else {
                return 'orange-class';
            }
        }
        return '';
    }

    getLightIcon(plant: any): string {
        const light = plant.kit_id && plant.kitReadings?.length > 0
            ? plant.kitReadings[plant.kitReadings.length - 1].luz
            : plant.ideal_light;

        if (light && plant.ideal_light) {
            const diff = Math.abs(light - plant.ideal_light);
            if (diff <= 20) {
                return 'check'; // Sucesso
            } else if (diff <= 50) {
                return 'alert-triangle'; // Alerta
            } else {
                return 'exclamation-circle'; // Erro
            }
        }
        return '';
    }

    getHumidityClass(plant: any): string {
        const humidity = plant.kit_id && plant.kitReadings?.length > 0
            ? plant.kitReadings[plant.kitReadings.length - 1].humidade
            : plant.ideal_humidity;

        if (humidity && plant.ideal_humidity) {
            const diff = Math.abs(humidity - plant.ideal_humidity);
            if (diff <= 10) {
                return 'green-class';
            } else if (diff <= 20) {
                return 'yellow-class';
            } else {
                return 'orange-class';
            }
        }
        return '';
    }

    getHumidityIcon(plant: any): string {
        const humidity = plant.kit_id && plant.kitReadings?.length > 0
            ? plant.kitReadings[plant.kitReadings.length - 1].humidade
            : plant.ideal_humidity;

        if (humidity && plant.ideal_humidity) {
            const diff = Math.abs(humidity - plant.ideal_humidity);
            if (diff <= 10) {
                return 'check'; // Sucesso
            } else if (diff <= 20) {
                return 'alert-triangle'; // Alerta
            } else {
                return 'exclamation-circle'; // Erro
            }
        }
        return '';
    }

}
function forkJoin(observables: Observable<any>[]): Observable<any[]> {
    return rxjsForkJoin(observables);
}
