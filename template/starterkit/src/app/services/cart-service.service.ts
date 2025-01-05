import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imagem?: string;
  isKit?: string;
  category_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
    private cart: CartItem[] = this.loadCartFromLocalStorage();
    private cartSubject = new BehaviorSubject<CartItem[]>(this.cart);
    cart$ = this.cartSubject.asObservable();

    constructor() {
      this.cart = this.loadCartFromLocalStorage();
    }
  
    private loadCartFromLocalStorage(): CartItem[] {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];  
    }

    private saveCartToLocalStorage(): void {
      localStorage.setItem('cart', JSON.stringify(this.cart)); 
    }
  
    addToCart(product: CartItem): void {
        console.log('Adicionando ao carrinho:', product);
      const itemIndex = this.cart.findIndex((item) => item.id === product.id);
      if (itemIndex > -1) {
        this.cart[itemIndex].quantity += 1;
      } else {
        this.cart.push(product);
      }
      this.cartSubject.next(this.cart); 
      console.log('Carrinho:', this.cart);
      this.saveCartToLocalStorage();
    }
  
    updateQuantity(productId: number, quantity: number): void {
      const itemIndex = this.cart.findIndex((item) => item.id === productId);
      if (itemIndex > -1 && quantity > 0) {
        this.cart[itemIndex].quantity = quantity;
      } else if (itemIndex > -1 && quantity === 0) {
        this.cart.splice(itemIndex, 1); 
      }
      this.cartSubject.next(this.cart);
      this.saveCartToLocalStorage();
    }
  
    removeFromCart(productId: number): void {
      this.cart = this.cart.filter((item) => item.id !== productId);
      this.cartSubject.next(this.cart);
      this.saveCartToLocalStorage();
    }
  
    getCartTotal(): number {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}
