import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true
})

export class SidebarComponent implements OnInit {
  categories: any[] = []; // Vai armazenar as categorias da base de dados
  selectedCategories: Set<string> = new Set(); // Para armazenar as categorias selecionadas
  minPrice: number = 0;  // Preço mínimo
  maxPrice: number = 100;  // Preço máximo

  // Simulação de categorias que viria da base de dados
  ngOnInit(): void {
    this.categories = [
      { name: 'Plants', id: '1' },
      { name: 'Pots', id: '2' },
      { name: 'Tools', id: '3' },
      { name: 'Fertilizers', id: '4' }
    ];
  }

  toggleCategory(category: string) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.filterProducts();
  }

  filterProducts() {
    // Implementar a lógica de filtragem aqui 
  }

  setPriceFilter() {
    this.filterProducts();
  }
}