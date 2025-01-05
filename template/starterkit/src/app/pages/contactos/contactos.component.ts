import { Component, ViewEncapsulation } from '@angular/core';
import { AppContactComponent, AppContactDialogContentComponent } from 'src/app/components/contactos/contact.component';
import { AppFormHorizontalComponent } from 'src/app/components/contactos/form-horizontal/form-horizontal.component';
import { AppFormLayoutsComponent } from 'src/app/components/form-layouts/form-layouts.component';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  standalone: true,
  imports: [MaterialModule, AppFormLayoutsComponent],
  styleUrls: ['./contactos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactosComponent {}

