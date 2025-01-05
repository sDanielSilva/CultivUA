import { Component, OnInit } from "@angular/core";
import { QuizService } from "src/app/services/quiz.service";
import { Router } from "@angular/router";
import { MaterialModule } from "src/app/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ToastService } from "src/app/services/shared/toast.service";

@Component({
    selector: "app-quizpergunta",
    templateUrl: "./quizpergunta.component.html",
    styleUrls: ["./quizpergunta.component.scss"],
    standalone: true,
    imports: [ReactiveFormsModule, MaterialModule, RouterModule, CommonModule],
})
export class quizperguntaComponent implements OnInit {
    questions: any[] = []; // Lista de perguntas carregadas
    currentIndex: number = 0; // Índice da pergunta atual
    currentQuestion: any = null; // Pergunta atual
    selectedAnswers: Record<string, string | null> = {}; // Respostas selecionadas por chave de pergunta
    loading: boolean = true; // Variável para controlar o loading

    constructor(private quizService: QuizService, private router: Router, private toastService: ToastService) {}

    ngOnInit(): void {
        this.loadQuestions();
    }

    /**
     * Carrega as perguntas através do serviço.
     */
    loadQuestions(): void {
        this.quizService.getQuestions().subscribe({
            next: (questions) => {
                this.questions = questions;
                this.loading = false;

                // Inicializa a primeira pergunta
                if (questions.length > 0) {
                    this.currentQuestion = this.questions[0];

                    // Inicializa o estado das respostas como null
                    this.questions.forEach((q) => {
                        this.selectedAnswers[q.key] = null;
                    });
                }
            },
            error: (err) => {
                this.toastService.show('Error loading questions:', 'error', err); 
                this.loading = false; // Desativa o carregador mesmo se ocorrer erro
            },
        });
    }

    /**
     * Atualiza a resposta selecionada para a pergunta atual.
     * @param option Resposta escolhida
     */
    selectOption(option: string): void {
        if (this.currentQuestion) {
            this.selectedAnswers[this.currentQuestion.key] = option;
        }
    }

    /**
     * Navega para a próxima pergunta ou submete o quiz ao final.
     */
    nextQuestion(): void {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.currentQuestion = this.questions[this.currentIndex];
        } else {
            this.submitQuiz();
        }
    }

    /**
     * Submete o quiz com as respostas selecionadas.
     */
    submitQuiz(): void {
        const filteredAnswers = Object.entries(this.selectedAnswers).reduce(
            (result, [key, answer]) => {
                if (answer !== null) {
                    result[key] = answer;
                }
                return result;
            },
            {} as Record<string, string>
        );

        this.quizService.submitAnswers(filteredAnswers).subscribe({
            next: (response) => {
                this.router.navigate(['/quizresultados'], { state: { plants: response } });
            },
            error: (err) => {
                this.toastService.show('Error submitting answers:', 'error', 3000); 
            }
        });
        
    }


    /**
     * Calcula o progresso do quiz como uma percentagem.
     */
    get progress(): number {
        return ((this.currentIndex + 1) / this.questions.length) * 100;
    }
}
