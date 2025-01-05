import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiceinvoiceService, Category} from '../serviceinvoice.service';
import { InvoiceList } from '../invoice';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OkDialogComponent } from './ok-dialog/ok-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { QuizresultadosComponent1 } from 'src/app/components/quizresultados/quizresultado.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    RouterModule,
  ],
})
export class AppEditCategoryComponent {
  addForm: FormGroup;
  category: Category | null = null;
  isSaving: boolean = false; // Variável para controlar o estado de loading

  constructor(
    private fb: FormBuilder,
    private categoryService: ServiceinvoiceService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Inicializar o formulário
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      show: [false],
      blog: [false],
    });

    // Obter o ID da categoria na rota
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));

    // Procurar os dados da categoria
    this.categoryService.getCategoryById(categoryId).subscribe(
      (data) => {
        this.category = data;
        this.populateForm(data);
      },
      (error) => {
        this.toastService.show('Error loading category!', 'error');
        this.router.navigate(['/categoriaAdmin']);
      }
    );
  }

  // Preenche o formulário com os dados da categoria
  populateForm(category: Category): void {
    this.addForm.patchValue({
      name: category.name,
      show: category.mostrarLoja,
      blog: category.mostrarBlog,
    });
  }

  // Guardar alterações
  saveDetail(): void {
    if (this.addForm.valid && this.category) {
      const updatedCategory: Category = {
        ...this.category,
        ...this.addForm.value, // Atualiza os campos do formulário
      };

      // Ativa o spinner enquanto o processo de atualização está em andamento
      this.isSaving = true;

      this.categoryService.updateCategory(updatedCategory.id, updatedCategory).subscribe(
        () => {
          // Desativa o spinner após a conclusão da requisição
          this.isSaving = false;

          // Mostra a caixa de diálogo de sucesso
          this.dialog
            .open(OkDialogComponent, { width: '250px' })
            .afterClosed()
            .subscribe(() => {
              this.router.navigate(['/categoriaAdmin']); // Redireciona após guardar
            });
        },
        (error) => {
          // Desativa o spinner em caso de erro
          this.isSaving = false;
            this.toastService.show('Error saving category!', 'error');
        }
      );
    }
  }
}
