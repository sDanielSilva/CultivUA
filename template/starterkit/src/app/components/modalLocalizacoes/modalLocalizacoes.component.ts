import { LocationService } from 'src/app/services/location.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-add-location-dialog',
  templateUrl: './modalLocalizacoes.component.html',
    standalone: true,
      imports: [
        MaterialModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TablerIconsModule,

    ],
})
export class AddLocationDialogComponent {
  addForm: FormGroup;
  isSaving: boolean = false; // Controle do estado de guardamento

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    public dialogRef: MatDialogRef<AddLocationDialogComponent>,
    private toastService: ToastService
  ) {
    this.addForm = this.fb.group({
      name: ['', Validators.required], // Campo obrigatório
    });
  }

  saveDetail(): void {
    if (this.addForm.valid) {
      this.isSaving = true; // Ativar o spinner
      const locationName = this.addForm.value.name;

      this.locationService.addLocation({ name: locationName }).subscribe({
        next: () => {
          this.dialogRef.close(true); // Fechar o modal após sucesso
          window.location.reload();
        },
        error: (err) => {
            this.toastService.show('Error saving location!', 'error');
          this.isSaving = false; // Desativar o spinner em caso de erro
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Fechar o modal sem guardar
  }
}
