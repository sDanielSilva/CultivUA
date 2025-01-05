import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [FormsModule],
  standalone: true
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  
  // Variáveis para capturar dados do user
  email: string = '';
  name: string = '';
  phone: string = '';
  address_line1: string = '';

  @ViewChild('cardInfo') cardInfo!: ElementRef;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  async ngOnInit() {
    // Carregar o Stripe
    this.stripe = await loadStripe('pk_test_51QVyQKCVGgYYTMcGcrd9GlMis3MaSwrP1w10LkkpB8gXNeHRe4xbvVX49VD5lZzXThbmyEtARrf8cIk0ftZXfZAX00SuhrxaER');

    if (!this.stripe) {
      return;
    }

    // Criar elementos do Stripe
    this.elements = this.stripe.elements();

    if (!this.elements) {
      return;
    }

    // Criar e montar o elemento do cartão
    this.cardElement = this.elements.create('card');

    if (!this.cardElement) {
      return;
    }

    this.cardElement.mount(this.cardInfo.nativeElement);
  }

  async handlePayment() {
    if (!this.stripe || !this.cardElement) {
      return;
    }

    // Criar o token
    const { token, error } = await this.stripe.createToken(this.cardElement);

    if (error) {
      this.toastService.show(`Erro no pagamento`, 'error', 3000);
    } else if (token) {
      // Enviar o token e dados para o backend
      const paymentData = {
        token: token.id,
        amount: 1000,
        email: this.email,
        name: this.name,
        phone: this.phone,
        address_line1: this.address_line1
      };

      this.http.post('http://localhost:8000/api/process-payment', paymentData)
        .subscribe(
          (response: any) => {
            this.toastService.show(`Pagamento bem-sucedido`, 'success', 3000);
          },
          (error) => {
            this.toastService.show(`Falha ao processar pagamento`, 'error', 3000);
          }
        );
    }
  }
}
