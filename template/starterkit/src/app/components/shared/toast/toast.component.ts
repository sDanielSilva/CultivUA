import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule, MatIconModule],
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' = 'success';

  constructor() {}
}
