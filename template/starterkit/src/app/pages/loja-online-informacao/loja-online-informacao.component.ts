import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from 'src/app/components/loja-online/produtos/products.component';
import { SidebarComponent } from 'src/app/components/loja-online/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { AppCardsLojaComponent } from 'src/app/components/loja-online/cards/cards.component';
import { Router } from '@angular/router';
import { AppFormWizardComponent } from 'src/app/components/loja-online/form-wizard/form-wizard.component';

@Component({
  selector: 'app-loja-online-informacao',
  templateUrl: './loja-online-informacao.component.html',
  styleUrls: ['./loja-online-informacao.component.css'],
  imports: [
    CommonModule,
    ProductsComponent,
    SidebarComponent,
    FormsModule,
    AppCardsLojaComponent,
    AppFormWizardComponent
  ],
  
  standalone: true
})

export class LojaOnlineInformacaoComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    
  }
  goBack(): void {
    this.router.navigate(['/']);  // Navega de volta para a página inicial (ajuste o caminho se necessário)
  }
}