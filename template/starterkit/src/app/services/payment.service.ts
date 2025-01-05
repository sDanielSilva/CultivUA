import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null;
  private apiUrl = 'http://localhost:8000/api'; // URL base do backend

  constructor(private http: HttpClient) {
    // Carregar o Stripe.js
    loadStripe('pk_test_51QVyQKCVGgYYTMcGcrd9GlMis3MaSwrP1w10LkkpB8gXNeHRe4xbvVX49VD5lZzXThbmyEtARrf8cIk0ftZXfZAX00SuhrxaER').then((stripe) => {
      this.stripe = stripe;
    });
  }

  // Criar o PaymentIntent no backend
  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payment-intent`, { amount });
  }

  // Confirmar o pagamento com o client secret
  confirmPayment(clientSecret: string, cardElement: any): Observable<any> {
    if (!this.stripe) {
      throw new Error("Stripe não carregou corretamente.");
    }

    return new Observable(observer => {
      this.stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      }).then(result => {
        if (result.error) {
          observer.error(result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
          observer.next(result.paymentIntent);
        }
      });
    });
  }
}
