import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'material.module';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [MaterialModule],
  standalone: true,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);  // Retorna 'true' quando o post for confirmado para apagarr
  }

  onCancel(): void {
    this.dialogRef.close(false);  // Retorna 'false' quando o cancelamento ocorrer
  }
}
