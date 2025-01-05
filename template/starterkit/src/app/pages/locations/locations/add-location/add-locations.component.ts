import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../services/location.service';
import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AddedDialogComponent } from './add-loc-dialogo/add-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-locations.component.html',
      standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TablerIconsModule,

  ],
})
export class AddLocationComponent {
  addForm: UntypedFormGroup;
  isSaving: boolean = false; // Controle do estado de guardamento

  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private dialog: MatDialog,
    private router: Router,
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
          this.dialog.open(AddedDialogComponent).afterClosed().subscribe(() => {
            // Redirecionar para a lista de localizações após fechar o dialog
            this.router.navigate(['/listaLocalizacoes']);
          });
        },
        error: (err) => {
            this.toastService.show('Error saving location:', 'error', 3000);
          this.isSaving = false; // Desativar o spinner em caso de erro
        },
      });
    }
  }
}
