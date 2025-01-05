import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // Make sure this is imported
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'material.module';

@Component({
  selector: 'app-selecoesquiz',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TablerIconsModule, MatChipsModule, RouterModule, MaterialModule],
  templateUrl: './quizresultado.component.html',
  styleUrls: ['./quizresultado.component.scss'],
})
export class QuizresultadosComponent1{
constructor(private router: Router) {}
comprar(): void{
    this.router.navigate(['/loja-online']);
}
}
