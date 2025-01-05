import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { TablerIconsModule } from 'angular-tabler-icons';
import {DatePipe} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, MatIconModule, TablerIconsModule, DatePipe, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class AppFooterComponent {
  constructor() {}
}
