import { Component } from '@angular/core';
import { PaymentService } from '../services/paymentService';
import { PaymentRequest } from '../models/payment-request.model';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  constructor(private paymentService: PaymentService) {}

  pay() {
    const request: PaymentRequest = {
      amount: 1000, // 10€
      currency: 'eur',
      successUrl: 'http://localhost:4200/success',
      cancelUrl: 'http://localhost:4200/cancel',
    };

    this.paymentService.createCheckoutSession(request).subscribe({
      next: (sessionUrl: string) => {
        // Redirection vers la page Stripe
        window.location.href = sessionUrl;
      },
      error: (err) => {
        console.error('Erreur lors de la création de la session :', err);
      }
    });
  }
}
