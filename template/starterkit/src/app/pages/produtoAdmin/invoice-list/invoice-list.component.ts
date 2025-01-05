import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ServiceinvoiceService } from '../serviceinvoice.service';
import { InvoiceList } from '../invoice';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { style } from '@angular/animations';
import { ProductaddModalComponent } from 'src/app/components/modalProdutos/modalProduto.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogProductComponent } from 'src/app/components/modalProdutos/modalDelete.component';
import { EditProductModalComponent } from 'src/app/components/modalProdutos/modalEditProduto/modalEditProduto.component';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    MatDialogModule,
    ProductaddModalComponent,
    ConfirmDialogProductComponent,
    EditProductModalComponent,
  ],
})
export class AppInvoiceListComponent implements AfterViewInit {
  allComplete: boolean = false;
  isLoading = false;
    categories: any[] = [];

  // Initialize the MatTableDataSource with an empty array
  invoiceList: MatTableDataSource<InvoiceList> = new MatTableDataSource<InvoiceList>();

  displayedColumns: string[] = [ 'name', 'category' ,'price', 'stock', 'image', 'editar'];

  @ViewChild(MatSort) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private invoiceService: ServiceinvoiceService, private dialog: MatDialog, private toastService: ToastService) {}

  ngOnInit(): void {
    this.isLoading = true; // Ativa o spinner enquanto carrega os dados

    // Procura os produtos e atualiza a tabela
    this.invoiceService.getInvoiceList().subscribe({
      next: (invoices) => {
        // Define os dados no MatTableDataSource
        this.invoiceList.data = invoices;

        // Adia a associação do paginator e sort para o próximo ciclo do Angular
        setTimeout(() => {
          this.invoiceList.paginator = this.paginator;
          this.invoiceList.sort = this.sort;
        });

        this.isLoading = false; // Interrompe o spinner ao finalizar
      },
      error: (err) => {
        this.toastService.show('Error loading products', 'error', 3000);
        this.isLoading = false; // Interrompe o spinner mesmo em caso de erro
      }
    });
      this.invoiceService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  // Configurações do filtro e associações adicionais para paginator e sort
  ngAfterViewInit(): void {
    // Personalização do filtro para pesquisar por nome ou categoria
    this.invoiceList.filterPredicate = (data: InvoiceList, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchTerm) ||
        data.categories_id.toLowerCase().includes(searchTerm)
      );
    };
  }

  // Função para aplicar o filtro na tabela
  filter(filterValue: string): void {
    this.invoiceList.filter = filterValue.trim().toLowerCase();
  }

 /*  ngOnInit(): void {
  this.invoiceService.getInvoiceList().subscribe((invoices) => {
    console.log(invoices);  // Adicione esse log para depurar os dados
    this.invoiceList.data = invoices;
    });
  }

  ngAfterViewInit(): void {
    // Customize filterPredicate to search both name and category
    this.invoiceList.filterPredicate = (data: InvoiceList, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchTerm) ||
        data.categories_id.toLowerCase().includes(searchTerm)
      );
    };

    this.invoiceList.paginator = this.paginator;
    this.invoiceList.sort = this.sort;
  }

  // Filter function to search products by name or category
  filter(filterValue: string): void {
    this.invoiceList.filter = filterValue.trim().toLowerCase();
  } */

 /*  ngOnInit(): void {
    this.isLoading = true; // Ativa o spinner enquanto carrega os dados

    // Procura os produtos e atualiza a tabela
    this.invoiceService.getInvoiceList().subscribe({
      next: (invoices) => {
        console.log(invoices); // Para depuração

        // Define os dados no MatTableDataSource
        this.invoiceList.data = invoices;

        // Associa paginator e sort após carregar os dados
        this.invoiceList.paginator = this.paginator;
        this.invoiceList.sort = this.sort;

        this.isLoading = false; // Interrompe o spinner ao finalizar
      },
      error: (err) => {
        console.error("Erro ao carregar produtos:", err);
        this.isLoading = false; // Interrompe o spinner mesmo em caso de erro
      }
    });
  }

  // Configurações do filtro e associações adicionais para paginator e sort
  ngAfterViewInit(): void {
    // Personalização do filtro para pesquisar por nome ou categoria
    this.invoiceList.filterPredicate = (data: InvoiceList, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchTerm) ||
        data.categories_id.toLowerCase().includes(searchTerm)
      );
    };
  }

  // Função para aplicar o filtro na tabela
  filter(filterValue: string): void {
    this.invoiceList.filter = filterValue.trim().toLowerCase();
  } */

  // Delete invoice function
deleteInvoice(id: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogProductComponent, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe((confirmed) => {
    if (confirmed) {
      this.invoiceService.deleteInvoice(id).subscribe(
        () => {
            this.toastService.show('Product successfully deleted', 'success', 3000);
          // Atualizar a lista removendo o produto excluído
          this.invoiceList.data = this.invoiceList.data.filter(
            (invoice) => invoice.id !== id
          );
        },
        (error) => {
            console.error('Error deleting product:', error);
        }
      );
    }
  });
}
openProductModal(): void {
  const dialogRef = this.dialog.open(ProductaddModalComponent, {
    width: '500px',
    data: { categories: this.categories }, // Passa as categorias para o modal
  });

  dialogRef.afterClosed().subscribe((result: FormData) => {
    if (result) {
      // Chamar o serviço para guardar os dados no backend
      this.invoiceService.addInvoice(result).subscribe(
        (createdInvoice) => {
          console.log('Product added:', createdInvoice);
  //        this.loadInvoice(); // Atualiza a lista de produtos
             window.location.reload();
        },
        (error) => {
            this.toastService.show('Error adding product', 'error', 3000);
        }
      );
    }
  });
}
loadProducts(): void {
  this.isLoading = true; // Show loading spinner

  this.invoiceService.getInvoiceList().subscribe({
    next: (invoices) => {
      this.invoiceList.data = invoices;

      // Reassign paginator and sort
      setTimeout(() => {
        this.invoiceList.paginator = this.paginator;
        this.invoiceList.sort = this.sort;
      });

      this.isLoading = false; // Hide loading spinner
    },
    error: (err) => {
      this.toastService.show('Error loading products', 'error', 3000);
      this.isLoading = false;
    }
  });
}
openEditModal(product: any): void {
  const dialogRef = this.dialog.open(EditProductModalComponent, {
    width: '600px',
    data: { product },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Atualize a lista ou faça ações adicionais
      this.loadProducts();
    }
  });
}


}
