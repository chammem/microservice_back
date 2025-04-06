import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-panier',
  imports: [CommonModule,RouterModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent {
  shippingCost = 10.00; // Frais de livraison fixes à 10.00$

  constructor(private router: Router) {}

  goToCheckout() {
    this.router.navigate(['/commande']);
  }
  cartItems = [
    { name: 'T-SHIRT CONTRAST POCKET', price: 98.49, quantity: 4, image: 'assets/images/product-1.jpg' },
    { name: 'DIAGONAL TEXTURED CAP', price: 98.49, quantity: 1, image: 'assets/images/product-2.jpg' },
    { name: 'BASIC FLOWING SCARF', price: 98.49, quantity: 1, image: 'assets/images/product-3.jpg' }
  ];

  getSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }
}
