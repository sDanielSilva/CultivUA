import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // A importar o MatProgressSpinnerModule

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule, MatProgressSpinnerModule], // Adicionando MatProgressSpinnerModule
  styleUrls: ['./quiz.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuizComponent implements AfterViewInit {
  isLoading: boolean = true;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Simulando um tempo de loading (você pode substituir isso por uma lógica real)
    setTimeout(() => {
      this.isLoading = false;
    }, 1000); // Ajuste conforme necessário
  }

  redirectToQuiz(): void {
    this.router.navigate(['/quizpergunta']);
  }
}
