import { ProductaddModalComponent } from './../../../components/modalProdutos/modalProduto.component';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceList } from '../invoice';
import { ServiceinvoiceService } from '../serviceinvoice.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddedDialogComponent } from './added-dialog/added-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
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
export class AppAddInvoiceComponent implements OnInit {
  addForm: UntypedFormGroup | any;
  rows: FormArray;
  invoice: InvoiceList = new InvoiceList();
  invoiceList: InvoiceList[] = [];
  categories: any[] = [];
  selectedImage: string | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private invoiceService: ServiceinvoiceService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário de forma imediata
    this.addForm = this.fb.group({
      rows: this.fb.array([]),
    });

    this.rows = this.addForm.get('rows') as FormArray;
    this.rows.push(this.createItemFormGroup());

    // Procurar a lista de produtos para calcular o novo ID da produto
    this.invoiceService.getInvoiceList().subscribe((invoices) => {
      this.invoiceList = invoices;
      this.invoice.id =
        Math.max.apply(
          Math,
          this.invoiceList.map((o: InvoiceList) => o.id)
        ) + 1;
    });

    // Procurar todas as categorias no backend
    this.invoiceService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  // Função para criar o FormGroup de cada linha
  createItemFormGroup(): UntypedFormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      threshold: ['', Validators.required],
      category: ['', Validators.required], // Certificando-se de que "category" está definido
      imagem: ['', Validators.required],
    });
  }

  // Função para guardar os detalhes da produto
saveDetail(): void {
  if (this.addForm.valid) {
    const formValue = this.addForm.value.rows[0];

    // Creating FormData
    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('categories_id', formValue.category); // ID of the category
    formData.append('price', formValue.price);
    formData.append('stock', formValue.stock);
    formData.append('threshold', formValue.threshold);

    // If the image exists, append it as well
    const imagens = formValue.imagem || [];
    imagens.forEach((file: File, index: number) => {
      formData.append(`imagem[${index}]`, file); // Correção aqui´
      this.selectedImage = file.name;
    });

    // Call the service to make the HTTP request
    this.invoiceService.addInvoice(formData).subscribe(
      (createdInvoice) => {
        this.dialog.open(AddedDialogComponent, {
          width: '250px',
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/produtoAdmin']);
        });
      },
      (error) => {
        console.error('Error adding invoice:', error);
      }
    );
  } else {
    console.log('Form is invalid');
  }
}

onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
        const file = input.files[0];

        // Atualizar o campo 'imagem' com o arquivo selecionado
        const row = this.rows.at(index) as UntypedFormGroup;
        if (row) {
            const currentImages = row.get('imagem')?.value || [];
            row.patchValue({
                imagem: [...currentImages, file], // Adiciona o arquivo diretamente
            });
        }
    }
}
loadInvoices(): void {
  this.invoiceService.getInvoiceList().subscribe(
    (invoices) => {
      this.invoiceList = invoices;
    },
    (error) => {
      console.error('Error loading products:', error);
    }
  );
}
}



