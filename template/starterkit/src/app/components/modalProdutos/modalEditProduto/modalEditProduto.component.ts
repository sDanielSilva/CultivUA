import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceProductAdmin } from '../../../services/admin-product.service';
import { MaterialModule } from 'material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './modalEditProduto.component.html',
  styleUrls: ['./modalEditProduto.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditProductModalComponent implements OnInit {
  editForm!: FormGroup;
  categories: any[] = [];
  isSaving = false;
  selectedImage: string | null = null;
  selectedImageA: string | null = null;

  constructor(
    private fb: FormBuilder,
    private serviceProductAdmin: ServiceProductAdmin,
    private dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      threshold: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categories_id: [null, Validators.required],
      scientific_name: [null],
      description: [null],     
      size: [null],            
      image: [null],
      isKit: [false]
    });
  }

loadCategories(): void {
  this.serviceProductAdmin.getCategories().subscribe({
    next: (data) => {
      this.categories = data;

      // Call populateForm after categories are loaded
      this.populateForm();
    },
    error: (err) => {
      this.toastService.show('Erro ao carregar as Categorias!', 'error');
    }
  });
}


populateForm(): void {
  if (this.data && this.data.product) {
    const product = this.data.product;


    // Match the category by name instead of id
    const selectedCategory = this.categories.find(
      (cat) => cat.name === product.categories_id
    );


    // Patch the form with the selected category's ID (if found) or null
    this.editForm.patchValue({
      name: product.name,
      price: product.price,
      threshold: product.threshold,
      stock: product.stock,
      categories_id: selectedCategory ? selectedCategory.id : null, // Use matched ID or null
      scientific_name: product.scientific_name || null,
      description: product.description || null,         
      size: product.size || null,                      
      isKit: product.isKit || false
    });

    this.selectedImageA = product.imagem;
  }
}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.editForm.patchValue({ image: this.selectedImage });
      };
      reader.readAsDataURL(file);
    }
  }

saveProduct(): void {
  if (this.editForm.valid) {
    this.isSaving = true;
    const productData = this.editForm.value;

    this.serviceProductAdmin.updateProduct(this.data.product.id, productData).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close(true); // Fecha o modal e retorna sucesso
      },
      error: (err) => {
        this.toastService.show('Error saving the product!', 'error');
        this.isSaving = false;
      }
    });
  }
}
  close(): void {
    this.dialogRef.close(false); // Fecha o modal sem guardar
  }
}
