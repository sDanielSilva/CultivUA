import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { ServiceProductAdmin } from '../../../services/admin-product.service';
import { CommonModule } from '@angular/common';
import { routes } from 'src/app/app.routes';
import { OkDialogComponent } from '../edit-product/ok-dialog/ok-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class AppEditProductComponent {
  editForm!: FormGroup;
  product: any;
  categories: any[] = [];
  isSaving = false;
  isLoading = false;
  selectedImage: string | null = null;
  selectedImageA: string | null = null;

  constructor(
    private fb: FormBuilder,
    private serviceProductAdmin: ServiceProductAdmin,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(MatDialog) private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    this.isLoading = true;
   /*  this.loadProduct(productId); */
    this.loadCategories();

this.editForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    threshold: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categories_id: ['', Validators.required],
    image: [null],
});
  }

/* loadProduct(id: number): void {
    this.serviceProductAdmin.getProduct(id).subscribe({
        next: (data) => {
            this.product = data;
            this.editForm.patchValue({
                name: this.product.name,
                price: this.product.price,
                threshold: this.product.threshold,
                stock: this.product.stock,
                categories_id: this.product.categories_id,
                image: null,
            });
            console.log(this.product);
        },
        error: (err) => {
            console.error('Erro ao carregar o produto:', err);
        }
    });
}
 */

  loadCategories(): void {
    this.serviceProductAdmin.getCategories().subscribe((data) => {
      this.categories = data;
    });
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
      this.serviceProductAdmin.updateProduct(this.product.id, this.editForm.value).subscribe({
        next: () => {
          this.isSaving = false;

          // Abrir o diálogo
            this.dialog.open(OkDialogComponent, {
            data: {
              title: 'Operation Successful',
              message: 'The product has been updated successfully!',
            },
            });

          // Navegar após o diálogo (opcional, dependendo do fluxo desejado)
          this.router.navigate(['/produtoAdmin']);
        },
        error: (err) => {
          this.isSaving = false;
        }
      });
    }
  }
}
