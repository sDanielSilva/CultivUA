import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-loja-online-agradecimento',
  templateUrl: './loja-online-agradecimento.component.html',
  styleUrls: ['./loja-online-agradecimento.component.css'],
  standalone: true
})

export class LojaOnlineAgradecimentoComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Limpar o localStorage após o pagamento, se necessário
    if (urlParams.get('clearLocalStorage') === 'true') {
      localStorage.clear();
    }

    // Evitar recarregar a página em loops infinitos
    if (!sessionStorage.getItem('isReloaded')) {
      sessionStorage.setItem('isReloaded', 'true');
      window.location.reload(); // Forçar o reload
    } else {
      sessionStorage.removeItem('isReloaded');
    }

    // Obter o ID do pedido do sessionStorage
    const orderId = sessionStorage.getItem('orderId');
    
    if (orderId) {
      this.updateOrderStatus(orderId);
    } else {
      console.error('Order ID not found!');
    }
  }

  updateOrderStatus(orderId: string) {
    const statusData = { 
      status: 'completed',
      order_id: orderId // Enviar o orderId como order_id no corpo
    };
  
    this.http.put(`http://localhost:8000/api/orders/${orderId}/status`, statusData)
      .subscribe({
      next: (response) => {
        console.log('Order status updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
      });
  }
  
  

  goBack() {
    this.router.navigate(['/loja-online']);
  }
}
