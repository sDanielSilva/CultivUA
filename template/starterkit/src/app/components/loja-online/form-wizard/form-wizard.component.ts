import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { PaymentComponent } from '../../payment/payment.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { CartService } from 'src/app/services/cart-service.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/shared/toast.service';
@Component({
  selector: 'app-form-wizard',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, PaymentComponent, CommonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './form-wizard.component.html',
  styleUrls: ['./form-wizard.component.css']
})
export class AppFormWizardComponent {
  loading: boolean = false;  // Define como false inicialmente

  @ViewChild('cardElement') cardElementRef!: ElementRef;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  // Variáveis de estado
  deliveryCost: number = 0; // Custo da entrega
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  cartItems: any[] = []; // Itens do carrinho
  totalAmount: number = 0; // Total calculado
  totalQuantity: number = 0; // Quantidade total dos itens
  taxAmount: number = 0; // Imposto

  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private cartService: CartService, private router: Router, private toastService: ToastService) {
    this.initStripe();
    // Inicialização dos formulários
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      pincodePart1: ['', Validators.required],
      pincodePart2: ['', Validators.required],
      landmark: [''],
      addressType: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      deliveryOption: ['normal', Validators.required],
    });
  }



  async initStripe() {
    this.stripe = await loadStripe('pk_test_51QVyQKCVGgYYTMcGcrd9GlMis3MaSwrP1w10LkkpB8gXNeHRe4xbvVX49VD5lZzXThbmyEtARrf8cIk0ftZXfZAX00SuhrxaER'); // Chave pública
    if (this.stripe) {
      this.elements = this.stripe.elements();
      // A criar o elemento do cartão
      this.card = this.elements.create('card');
      
      if (this.cardElementRef && this.cardElementRef.nativeElement) {
        this.card.mount(this.cardElementRef.nativeElement); // Mounting the card on the referenced element
      }
    }
  }
  


  
  
// Dentro do seu método `makePayment`
async makePayment() {
  if (!this.stripe) {
    return;
  }
  this.loading = true;
  const amount = this.totalAmountWithoutTax();
  const personalData = this.firstFormGroup.value;
  const userId = sessionStorage.getItem('user_id');
  if (!userId) {
    this.loading = false;
    return;
  }

  const totalQuantity = this.cartItems.reduce((total, item) => total + item.quantity, 0);

  const paymentData = {
    user_id: userId,
    amount: amount,
    cartItems: this.cartItems,
    firstName: personalData.firstName,
    lastName: personalData.lastName,
    phone: personalData.phone,
    address: personalData.address,
    city: personalData.city,
    pincode: `${personalData.pincodePart1}-${personalData.pincodePart2}`,
    totalAmount: amount,
    totalQuantity: totalQuantity,
  };

  this.http.post('http://localhost:8000/api/create-order', paymentData).subscribe(async (orderResponse: any) => {
    if (orderResponse.message === 'Order created successfully!') {
      this.toastService.show('Order created!', 'success');
      
      // Verifica se o order_id está presente na resposta
      if (orderResponse.order_id) {
        sessionStorage.setItem('orderId', orderResponse.order_id);
      } else {
        this.toastService.show('Order ID not found in API response!', 'error');
        this.loading = false;
        return;
      }
  
      // Continue com o fluxo de criação do checkout
      this.http.post('http://localhost:8000/api/create-checkout-session', paymentData).subscribe(async (checkoutResponse: any) => {
        const sessionId = checkoutResponse.id;
        if (sessionId) {
          try {
            const { error } = await this.stripe!.redirectToCheckout({ sessionId });
            if (error) {
              this.loading = false;
            }
          } catch (err) {
            this.toastService.show('Error redirecting to checkout!', 'error');
            this.loading = false;
          }
        }
      });
    } else {
      this.toastService.show('Error creating order!', 'error');
      this.loading = false;
        }
      }, error => {
        this.toastService.show('Error creating order!', 'error');
    this.loading = false;
  });
  
}

  
onCompleteOrder(): void {
  const userSession = sessionStorage.getItem('auth_token');
  if (!userSession) {
    // Guarda a URL atual na Session Storage
    sessionStorage.setItem('redirectAfterLogin', this.router.url);

    // Redireciona para a página de login
    this.router.navigate(['/login']);
  } else {
    console.log('Active session, proceeding...');
  }
}
  
  




ngOnInit() {
  this.cartService.cart$.subscribe(cart => {
    this.cartItems = cart;
    this.calculateCart(); // Calcular os totais quando o carrinho mudar
  });
}


  // Função para calcular o total, imposto, e quantidade
  calculateCart() {
    let total = 0;
    let quantity = 0;
  
    this.cartItems.forEach(item => {
      total += item.price * item.quantity;
      quantity += item.quantity;
    });
  
    // Calcular o imposto (por exemplo, 10%)
    this.taxAmount = total * 0.10;
  
    // Calcular o total com imposto
    this.totalAmount = total + this.taxAmount;
    this.totalQuantity = quantity;
  }
  

  // Alterar a opção de entrega
  onDeliveryOptionChange(event: any): void {
    const selectedOption = event.value;
    this.deliveryCost = selectedOption === 'express' ? 2.5 : 0;
  }

  increaseQuantity(item: any): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
    this.calculateCart(); // Recalcular os totais
  }
  
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
    this.calculateCart(); // Recalcular os totais
  }
  
  removeItem(item: any): void {
    this.cartService.removeFromCart(item.id);
    this.calculateCart(); // Recalcular os totais
  }
  

  // Método para calcular o total sem imposto
  totalAmountWithoutTax(): number {
    const sum = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return parseFloat(sum.toFixed(2)); // Formatar para 2 casas decimais e garantir que seja um número
  }
  

  // Método para calcular o total com imposto (23%)
  totalAmountWithTax(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity * 1.23), 0);
  }


  
}

