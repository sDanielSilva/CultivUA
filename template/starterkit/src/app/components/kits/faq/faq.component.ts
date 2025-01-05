import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';  // Importa o Router

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [MatCardModule, MatExpansionModule, MatButtonModule],
  templateUrl: './faq.component.html',
})
export class AppFaqComponent {
  constructor(private router: Router) {}  // Injeta o Router

  // Função que será chamada quando o botão for clicado
  goToChat() {
    this.router.navigate(['/chat']);  // Redireciona para a página /chat
  }
}
