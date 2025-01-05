import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from 'src/app/components/loja-online/produtos/products.component';
import { SidebarComponent } from 'src/app/components/loja-online/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { AppCardsLojaComponent } from 'src/app/components/loja-online/cards/cards.component';
@Component({
  selector: 'app-loja-online',
  templateUrl: './loja-online.component.html',
  styleUrls: ['./loja-online.component.css'],
  imports: [
    CommonModule,
    ProductsComponent,
    SidebarComponent,
    FormsModule,
    AppCardsLojaComponent
  ],
  
  standalone: true
})

export class LojaOnlineComponent implements OnInit {
  ngOnInit(): void {
    
  }
}