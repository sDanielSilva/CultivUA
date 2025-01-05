import { Component, Output, EventEmitter, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LandingPageService, Product } from 'src/app/services/landing-page.service';
import { NewsletterComponent } from 'src/app/components/newsletter/newsletter.component';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-landingpage',
  standalone: true,


  imports: [CommonModule, MaterialModule, TablerIconsModule, RouterLink, NewsletterComponent, AppFooterComponent],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class AppLandingpageComponent implements OnInit{
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  products: Product[] = []; // Produtos exibidos no momento
  populares: Product[] = []; // Array para produtos "Populares"
  maisVendidos: Product[] = []; // Array para produtos "Mais Vendidos"
  novidades: Product[] = []; // Array para produtos "Novidades"

  isLoading: boolean = true; // Ativa o spinner
  selectedButton: string = 'novidades'; // Define o botão inicial selecionado

  trackByName(index: number, item: { name: string }): string {
    return item.name;
  }

  constructor(
    private LandingPageService: LandingPageService,
    private settings: CoreService,
    private scroller: ViewportScroller,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.loadAllProducts(); // Carrega todos os produtos
  }

 // Referências dos elementos DOM
 @ViewChild('videoPreview') videoPreview!: ElementRef;
 @ViewChild('video') video!: ElementRef;
 @ViewChild('playButton') playButton!: ElementRef;

 ngAfterViewInit(): void {
  // Garantir que os elementos DOM estão disponíveis
  if (this.video && this.videoPreview && this.playButton) {
    // Adiciona o evento de clique no botão de play
    this.playButton.nativeElement.addEventListener('click', () => this.playVideo());
  }
}



playVideo(): void {
  // Remove a imagem e o overlay, e mostra o vídeo
  this.videoPreview.nativeElement.classList.add('active');
  this.video.nativeElement.play(); // Inicia o vídeo
}
  loadAllProducts() {
    this.isLoading = true;

    // Executa todas as requisições e espera até todas serem concluídas
    this.LandingPageService.getPopulares().subscribe((data) => {
      this.populares = data; // Guarda os produtos "Populares"
      this.checkLoadingStatus();
    });

    this.LandingPageService.getMaisVendidos().subscribe((data) => {
      this.maisVendidos = data; // Guarda os produtos "Mais Vendidos"
      this.checkLoadingStatus();
    });

    this.LandingPageService.getNovidades().subscribe((data) => {
      this.novidades = data; // Guarda os produtos "Novidades"
      this.products = this.novidades; // Mostra "Novidades" inicialmente
      this.checkLoadingStatus();
    });
  }

  checkLoadingStatus() {
    // Verifica se todas as categorias já foram carregadas
    if (this.populares.length && this.maisVendidos.length && this.novidades.length) {
      this.isLoading = false; // Desativa o spinner quando tudo for carregado
    }
  }

  selectButton(button: string) {
    this.selectedButton = button;

    // Atualiza os produtos exibidos com base no botão selecionado
    if (button === 'populares') {
      this.products = this.populares;
    } else if (button === 'mais-vendidos') {
      this.products = this.maisVendidos;
    } else if (button === 'novidades') {
      this.products = this.novidades;
    }
  }

  options = this.settings.getOptions();

  gotoDashboard() {
    this.router.navigate(['/dashboard']);
  }

  gotoLoja() {
    this.router.navigate(['/starter']);
  }

  gotoQuiz() {
    this.router.navigate(['/quiz']);
  }

  gotoBlog() {
    this.router.navigate(['/blog']);
  }

  gotoContactos() {
    this.router.navigate(['/contactos']);
  }

  testimonials = [
    {
      name: 'Eminson Mendoza',
      position: 'Customer',
      text: '"CultivUA has drastically changed my life, this is better than anything I have tried before!"',
      image: 'assets/images/profile/user-1.jpg',
      rating: 5
    },
    {
      name: 'Anna Souza',
      position: 'Customer',
      text: '"CultivUA has significantly improved my daily routine, I highly recommend it to everyone!"',
      image: 'assets/images/profile/user-2.jpg',
      rating: 5
    },
    {
      name: 'Carlos Pereira',
      position: 'Customer',
      text: '"CultivUA has made a big difference in my life, it is almost better than anything else I have used!"',
      image: 'assets/images/profile/user-3.jpg',
      rating: 4
    }
  ];

}
