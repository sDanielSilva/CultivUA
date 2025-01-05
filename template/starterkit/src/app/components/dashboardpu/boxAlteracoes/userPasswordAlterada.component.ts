import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-ticketEnviado',
  templateUrl: './userPasswordAlterada.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class alteracoesPasswordComponent {
  constructor() {}
}
