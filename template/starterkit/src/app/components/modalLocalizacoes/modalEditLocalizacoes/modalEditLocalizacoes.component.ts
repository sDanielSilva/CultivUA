import { LocationService } from 'src/app/services/location.service';
import { Location } from './../../../pages/locations/locations/locations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-modal-edit-location',
  templateUrl: './modalEditLocalizacoes.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
})
export class ModalEditLocationComponent implements OnInit {
  editForm: FormGroup;
  location: Location;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private dialogRef: MatDialogRef<ModalEditLocationComponent>,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: { location: Location }
  ) {
    this.location = data.location;

    // Inicializar o formulário com os valores da localização
    this.editForm = this.fb.group({
      name: [this.location.name, Validators.required],
    });
  }

  ngOnInit(): void {}

  saveDetail(): void {
    if (this.editForm.valid) {
      this.isSaving = true;
      const updatedLocation: Location = {
        ...this.location,
        ...this.editForm.value,
      };

      this.locationService.updateLocation(updatedLocation.id, updatedLocation).subscribe({
        next: () => {
          this.isSaving = false;
          this.dialogRef.close(true);
          window.location.reload();
        },
        error: (err) => {
          this.toastService.show('Erro ao atualizar a localização!', 'error');
          this.isSaving = false;
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Indicar que a edição foi cancelada
  }
}
