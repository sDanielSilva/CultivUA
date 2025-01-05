import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-ticketEnviado',
  templateUrl: './userErroDados.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class userErroDadosComponent {
  constructor() {}
}
