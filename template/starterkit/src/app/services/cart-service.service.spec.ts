import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart-service.service';

describe('CartService', () => {
    let service: CartService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CartService);
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add an item to the cart', () => {
        const product: CartItem = { id: 1, name: 'Product 123', price: 100, quantity: 1 };
        service.addToCart(product);
    
        const cart = service['cartSubject'].getValue();
        expect(cart.length).toBe(1);
        expect(cart[0]).toEqual(product);
    }); 

    it('should remove an item from the cart', () => {
            const product: CartItem = { id: 1, name: 'Product teste', price: 100, quantity: 1 };
            service.addToCart(product);
            service.removeFromCart(1);
        
            const cart = service['cartSubject'].getValue();
            expect(cart.length).toBe(0);
        }); 
  
    it('should update the quantity of an existing item in the cart', () => {
        const product: CartItem = { id: 1, name: 'Product teste', price: 100, quantity: 1 };
        service.addToCart(product);
        service.updateQuantity(1, 3);

        const cart = service['cartSubject'].getValue(); // Obtém o valor atual diretamente
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(3);
    }); 
     
     /* 
    it('should calculate the total price of the cart', () => {
        const product1: CartItem = { id: 1, name: 'Product 1', price: 100, quantity: 2 };
        const product2: CartItem = { id: 2, name: 'Product 2', price: 50, quantity: 1 };
        service.addToCart(product1);
        service.addToCart(product2);
        expect(service.getCartTotal()).toBe(250);
    }); 

    it('should save cart to local storage',() => {
        const product: CartItem = { id: 1, name: 'Product Rosa', price: 100, quantity: 1 };
        service.addToCart(product);
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        expect(savedCart.length).toBe(1);
        expect(savedCart[0]).toEqual(product);
    });  */

    /* it('should load cart from local storage', () => {
        const product: CartItem = { id: 1, name: 'Product Banana', price: 100, quantity: 1 };
        localStorage.setItem('cart', JSON.stringify([product]));
    
        const newService = TestBed.inject(CartService);
        const cart = newService['cartSubject'].getValue();
        expect(cart.length).toBe(1);
        expect(cart[0]).toEqual(product);
    }); */
});