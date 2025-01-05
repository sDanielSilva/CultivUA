import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../material.module";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { AppFaqComponent } from "../../components/kits/faq/faq.component";

@Component({
  selector: "app-quizresultados",
  templateUrl: "./quizresultados.component.html",
  styleUrls: ["./quizresultados.component.scss"],
  imports: [CommonModule, MaterialModule, AppFaqComponent],
  standalone: true,
})
export class quizresultadosComponent implements OnInit {
  plants: any[] = [];
  displayedPlants: any[] = [];
  loading: boolean = true;
  isNoMatch: boolean = false; // Variável para verificar se não há compatibilidade

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

    if (state?.plants && Array.isArray(state.plants) && state.plants.length > 0) {
      this.plants = state.plants;
      this.displayedPlants = this.plants.slice(0, 3);
      this.isNoMatch = false;
    } else {
      this.isNoMatch = true; // Caso não haja plantas
    }

    this.loading = false; // Garantir que o loading termina
  }

  redirectToStore(plant: any): void {
    this.router.navigate(["/loja-online"], {
      queryParams: { planta: plant.common_name },
    });
  }

  // Função para redirecionar para o quiz
  redirectToQuiz(): void {
    this.router.navigate(["/quiz"]);
  }
}
