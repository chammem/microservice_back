import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../services/CommandeService';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule,RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrls : ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ){}

  today = new Date();

  nomClient: string = '';
  prenomClient: string = '';
  adresseClient: string = '';
  orderNumber: number;
  orderId: number | null = null;
  orderItems: any[] = []; // Liste des produits commandés
  subTotal: number = 0;
  shipping: number = 8;
  total: number = 0;

  ngOnInit(): void {
    // Récupérer l'ID depuis les paramètres de l'URL
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
  
    if (this.orderId) {
      console.log('ID de la commande:', this.orderId);
      
      // Appel au service pour récupérer les détails de la commande
      this.commandeService.getCommande(this.orderId).subscribe(
        (data) => {
          this.orderNumber = data.id;
          this.nomClient = data.nomClient;
          this.prenomClient = data.prenomClient;
          this.adresseClient = data.adresseClient;
          this.subTotal = data.totalCommande;
  
          // Récupérer les produits de la commande à partir du service
          this.commandeService.getProduits().subscribe(produits => {
            this.orderItems = produits;
            // Calculer le total de la commande (ici tu peux utiliser la somme des produits si besoin)
            this.total = this.subTotal + this.shipping;
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération de la commande:', error);
        }
      );
    } else {
      console.error('ID de commande non trouvé dans l\'URL');
    }
  }
  
}
