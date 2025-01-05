/* import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormControl,
  UntypedFormArray,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
export class AppAddInvoiceComponent {
  addForm: UntypedFormGroup | any;
  rows: UntypedFormArray;
  invoice: InvoiceList = new InvoiceList();

  ///////////////////////////////////////////////////////////
  subTotal = 0;
  vat = 0;
  grandTotal = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private invoiceService: ServiceinvoiceService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // tslint:disable-next-line - Disables all
    this.invoice.id =
      Math.max.apply(
        Math,
        this.invoiceService.getInvoiceList().map(function (o: any) {
          return o.id;
        })
      ) + 1;

    ///////////////////////////////////////////////////////////

    this.addForm = this.fb.group({});

    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);
    this.rows.push(this.createItemFormGroup());
  }

  ////////////////////////////////////////////////////////////////////////////////////
  onAddRow(): void {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number): void {
    const totalCostOfItem =
      this.addForm.get('rows')?.value[rowIndex].unitPrice *
      this.addForm.get('rows')?.value[rowIndex].units;

    this.subTotal = this.subTotal - totalCostOfItem;
    this.vat = this.subTotal / 10;
    this.grandTotal = this.subTotal + this.vat;
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): UntypedFormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      units: ['', Validators.required],
      unitPrice: ['', Validators.required],
      itemTotal: ['0'],
    });
  }

  itemsChanged(): void {
    let total: number = 0;
    // tslint:disable-next-line - Disables all
    for (
      let t = 0;
      t < (<UntypedFormArray>this.addForm.get('rows')).length;
      t++
    ) {
      if (
        this.addForm.get('rows')?.value[t].unitPrice !== '' &&
        this.addForm.get('rows')?.value[t].units
      ) {
        total =
          this.addForm.get('rows')?.value[t].unitPrice *
            this.addForm.get('rows')?.value[t].units +
          total;
      }
    }
  }
  ////////////////////////////////////////////////////////////////////

  saveDetail(): void {
    // tslint:disable-next-line - Disables all
     for (
      let t = 0;
      t < (<UntypedFormArray>this.addForm.get('rows')).length;
      t++
    ) {
      const o: order = new order();
      o.itemName = this.addForm.get('rows')?.value[t].itemName;
      o.unitPrice = this.addForm.get('rows')?.value[t].unitPrice;
      o.units = this.addForm.get('rows')?.value[t].units;
      o.unitTotalPrice = o.units * o.unitPrice;
      this.invoice.orders.push(o);
    }
    this.dialog.open(AddedDialogComponent);
    this.invoiceService.addInvoice(this.invoice);
    this.router.navigate(['/invoice']);
  }
}
 */

import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormControl,
  UntypedFormArray,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { InvoiceList } from '../invoice';
import { ServiceinvoiceService } from '../serviceinvoice.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddedDialogComponent } from './added-dialog/added-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss'],
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
export class AppAddCategoryComponent {
  addForm: UntypedFormGroup;
  invoice: InvoiceList = new InvoiceList();
  isSaving: boolean = false; // Variável para controlar o estado de guardamento

  constructor(
    private fb: UntypedFormBuilder,
    private invoiceService: ServiceinvoiceService,
    private router: Router,
    public dialog: MatDialog,
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
        },
        error: (err) => {
          this.toastService.show('Error saving category!', 'error');
          this.isSaving = false; // Desativar o estado de guardamento em caso de erro
        },
      });
    }
  }
}
