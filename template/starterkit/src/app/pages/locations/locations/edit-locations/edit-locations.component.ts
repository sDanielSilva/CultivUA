import { Location } from '../locations';
import { LocationService } from '../../../../services/location.service';
import { OkDialogComponent } from '../../../categoriaAdmin/edit-invoice/ok-dialog/ok-dialog.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ModalEditLocationComponent } from 'src/app/components/modalLocalizacoes/modalEditLocalizacoes/modalEditLocalizacoes.component';
import { ToastService } from 'src/app/services/shared/toast.service';



@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-locations.component.html',
        standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TablerIconsModule,
    ModalEditLocationComponent,
  ],
})
export class AppEditLocationComponent implements OnInit {
  editForm: FormGroup;
  location: Location | null = null;  // Corrigido para 'Location'
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

ngOnInit(): void {
  this.editForm = this.fb.group({
    name: ['', Validators.required]
  });

  const locationId = Number(this.route.snapshot.paramMap.get('id'));

  if (isNaN(locationId)) {
    this.router.navigate(['/listaLocalizacoes']); // Navegue para uma rota segura
    return;
  }

  this.locationService.getLocationById(locationId).subscribe(
    (data: Location) => {

      if (data) {
        this.location = data;
        this.populateForm(data);
      } else {
        this.router.navigate(['/listaLocalizacoes']);
      }
    },
    (error) => {
      this.router.navigate(['/listaLocalizacoes']);
    }
  );
}

populateForm(location: Location): void {
  if (location && location.name) {
    this.editForm.patchValue({
      name: location.name
    });
  } else {
    console.error('Invalid data location:', location);
  }
}

saveLocation(): void {
  if (this.editForm.valid && this.location) {
    const updatedLocation: Location = {
      ...this.location,
      ...this.editForm.value
    };

    this.isSaving = true;

    this.locationService.updateLocation(updatedLocation.id, updatedLocation).subscribe(
      () => {
        this.isSaving = false;

        // Abrir o OkDialogComponent
        this.dialog
          .open(OkDialogComponent, { width: '250px' })
          .afterClosed()
          .subscribe(() => {
            // Redirecionar para a lista de localizações após fechar o diálogo
            this.router.navigate(['/listaLocalizacoes']);
            
          });
      },
      (error) => {
        this.isSaving = false;
        this.toastService.show('Error saving location:', 'error', 3000);
      }
    );
  }
}

}
