import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentRequest } from '../models/payment-request.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8086/api/payment';

  constructor(private http: HttpClient) {}

  createCheckoutSession(request: PaymentRequest) {
    return this.http.post(this.apiUrl + '/create-checkout-session', request, {
      responseType: 'text' // car le backend renvoie juste une URL (string)
    });
  }
}
