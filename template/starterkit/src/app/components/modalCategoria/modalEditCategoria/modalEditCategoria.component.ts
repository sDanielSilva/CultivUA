import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceinvoiceService, Category } from '../../../pages/categoriaAdmin/serviceinvoice.service';
import { MaterialModule } from 'material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ToastService } from 'src/app/services/shared/toast.service';


@Component({
  selector: 'app-modal-edit-categoria',
  templateUrl: './modalEditCategoria.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class ModalEditCategoriaComponent implements OnInit {
  editForm: FormGroup;
  category: Category;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: ServiceinvoiceService,
    private dialogRef: MatDialogRef<ModalEditCategoriaComponent>,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: { category: Category }
  ) {
    this.category = data.category;
    this.editForm = this.fb.group({
      name: [this.category.name, Validators.required],
      show: [this.category.mostrarLoja],
      blog: [this.category.mostrarBlog],
    });
  }

  ngOnInit(): void {}

  saveDetail(): void {
    if (this.editForm.valid) {
      this.isSaving = true;
      const updatedCategory: Category = {
        ...this.category,
        name: this.editForm.value.name,
        mostrarLoja: this.editForm.value.show ?? false,
        mostrarBlog: this.editForm.value.blog ?? false,
      };


      this.categoryService.updateCategory(updatedCategory.id, updatedCategory).subscribe({
        next: () => {
          this.isSaving = false;
          this.dialogRef.close(true); // Indicar que a edição foi bem-sucedida
            this.toastService.show('Category updated successfully!', 'success');
         
          window.location.reload();
        },
        error: (err) => {
            this.toastService.show('Error updating category!', 'error');
          this.isSaving = false;
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Indicar que a edição foi cancelada
  }
}
