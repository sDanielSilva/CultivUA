import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'material.module';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './modalProduto.component.html',
  styleUrls: ['./modalProduto.component.scss'],
  standalone:true,
  imports:[
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProductaddModalComponent {
  productForm: UntypedFormGroup;
  categories: any[] = [];
  selectedImage: string | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ProductaddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: any[] },
    private toastService: ToastService
  ) {
    this.categories = data.categories;
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      threshold: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      scientific_name: [''],
      description: [''],
      size: [''],
      isKit: [false],
      imagem: [[]], // array para as imagens
    });
  }

  // Método para lidar com o upload de arquivos
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const currentImages = this.productForm.get('imagem')?.value || [];
    this.productForm.patchValue({
      imagem: [...currentImages, file],
    });
    this.selectedImage = file.name; // Nome do arquivo selecionado
  }
}

saveProduct(): void {
  if (this.productForm.valid) {
    const formValue = this.productForm.value;

    // Cria o FormData
    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('categories_id', formValue.category);
    formData.append('price', formValue.price);
    formData.append('stock', formValue.stock);
    formData.append('threshold', formValue.threshold);
    formData.append('scientific_name', formValue.scientific_name || '');
    formData.append('description', formValue.description || '');
    formData.append('size', formValue.size || '');
    formData.append('isKit', formValue.isKit ? '1' : '0');  // Converte boolean para string

    const imagens = formValue.imagem || [];
    imagens.forEach((file: File, index: number) => {
      formData.append(`imagem[${index}]`, file);
    });

    // Fecha o modal passando o FormData
    this.dialogRef.close(formData);
  } else {
    this.toastService.show('Formulário inválido!', 'warning');
  }
}

  close(): void {
    this.dialogRef.close();
  }
}
