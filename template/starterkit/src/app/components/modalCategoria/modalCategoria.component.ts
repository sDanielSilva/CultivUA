import { Component, Inject, OnInit } from '@angular/core';
import { LocationService } from 'src/app/services/location.service'; // Add this import
import { HttpClient } from '@angular/common/http'; // Add this import
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';  // Missing import for dialog components
import { MatButtonModule } from '@angular/material/button';  // Missing import for button components
import { CommonModule } from '@angular/common';
import { PlantService } from 'src/app/services/plant.service';
import { MaterialModule } from 'material.module';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ServiceinvoiceService } from 'src/app/pages/categoriaAdmin/serviceinvoice.service';
import { InvoiceList } from 'src/app/pages/categoriaAdmin/invoice';
import { AddedDialogComponent } from 'src/app/pages/categoriaAdmin/add-invoice/added-dialog/added-dialog.component';
import { ToastService } from 'src/app/services/shared/toast.service';
@Component({
  selector: 'app-addCategoria-dialog',
  templateUrl: './modalCategoria.component.html',
  //imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,  MatDialogModule,  // Add MatDialogModule here
  //  MatButtonModule, CommonModule],
  standalone: true,
    imports: [
        MaterialModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

  ],
})
export class AdicionarCategoriaCOmponent implements OnInit {
  addForm: UntypedFormGroup;
  invoice: InvoiceList = new InvoiceList();
  isSaving: boolean = false; // Variável para controlar o estado de guardamento

  constructor(
    private fb: UntypedFormBuilder,
    private invoiceService: ServiceinvoiceService,
    private router: Router,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AdicionarCategoriaCOmponent>,
    private toastService: ToastService
  ) {
    this.addForm = this.fb.group({
      name: ['', Validators.required], // Apenas um campo
    });
  }

  ngOnInit(): void {
    // Obtém o último ID e mostra no formulário
    const lastId = this.invoiceService.getLastCategoryId();
    this.invoice.id = lastId + 1; // Próximo ID
  }

  saveDetail(): void {
    if (this.addForm.valid) {
      this.isSaving = true; // Ativar o estado de guardamento
      const categoryName = this.addForm.value.name;

      this.invoiceService.addCategory(categoryName).subscribe({
        next: () => {
          this.isSaving = false; // Desativar o estado de guardamento
          this.dialog
            .open(AddedDialogComponent, { width: '250px' })
            .afterClosed()
            .subscribe(() => {
              this.router.navigate(['/categoriaAdmin']);
            });
                this.onCancel();
                window.location.reload();

        },
        error: (err) => {
            this.toastService.show('Error saving category!', 'error');
          this.isSaving = false; // Desativar o estado de guardamento em caso de erro
        },
      });
    }
  }
    onCancel(): void {
    this.dialogRef.close();
  }
}

