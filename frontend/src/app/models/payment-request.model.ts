export interface PaymentRequest {
    amount: number; // en centimes
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }
  