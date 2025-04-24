import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/paymentService';
import { PaymentRequest } from '../models/payment-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent  {
  total: number = 0;

  orderId!: number;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('orderId')!;
  }

  payerParCarte(): void {
    this.http.post<string>(
      'http://localhost:8093/commandes/checkout',
      { orderId: this.orderId },
      { responseType: 'text' as 'json' }
    ).subscribe({
      next: (checkoutUrl: string) => {
        window.location.href = checkoutUrl;
      },
      error: (err) => {
        console.error('Erreur :', err);
        alert('Erreur pendant le paiement.');
      }
    });
  }


  payerSurPlace(): void {
    // Redirection directe vers confirmation
    window.location.href = '/confirmation';
  }
}
