import { ConfirmDialogComponent } from './../../../components/modalCategoria/modalDelete.component';

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ServiceinvoiceService, Category } from '../serviceinvoice.service';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { AdicionarCategoriaCOmponent } from 'src/app/components/modalCategoria/modalCategoria.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ModalEditCategoriaComponent } from 'src/app/components/modalCategoria/modalEditCategoria/modalEditCategoria.component';
import { ProductaddModalComponent } from 'src/app/components/modalProdutos/modalProduto.component';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-category-list',
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
    AdicionarCategoriaCOmponent,
    ModalEditCategoriaComponent,
    ConfirmDialogComponent,
  ],
})


export class AppCategoryListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'number', 'show', 'blog', 'action'];
  categories: MatTableDataSource<Category> = new MatTableDataSource<Category>([]);
  isLoading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private categoryService: ServiceinvoiceService, private dialog: MatDialog, private toastService: ToastService) {}

  ngAfterViewInit(): void {
    this.loadCategories();
    this.categories.paginator = this.paginator;
    this.categories.sort = this.sort;
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.data = data;
        this.categories.paginator = this.paginator;
        this.categories.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.show('Error loading categories!', 'error');
        this.isLoading = false;
      }
    });
  }

  filter(filterValue: string): void {
    this.categories.filter = filterValue.trim().toLowerCase();
    if (this.categories.paginator) {
      this.categories.paginator.firstPage();
    }
  }

deleteCategory(id: number): void {
  this.categoryService.deleteCategory(id).subscribe({
    next: () => {
      this.categories.data = this.categories.data.filter((cat) => cat.id !== id);
      this.toastService.show('Category successfully deleted!', 'success');
    },
    error: (err) => {
      this.toastService.show('Error deleting category!', 'error');
    }
  });
}

  openEditDialog(): void {
    this.dialog.open(AdicionarCategoriaCOmponent);
  }
  openEditarDialog(category: Category): void {
  this.dialog.open(ModalEditCategoriaComponent, {
    data: { category }
  });
}
confirmDelete(id: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
  });

  dialogRef.afterClosed().subscribe((confirmed) => {
    if (confirmed) {
      this.deleteCategory(id); // If the user confirms, the deletion is executed
    }
  });
}

}
