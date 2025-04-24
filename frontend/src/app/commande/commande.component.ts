import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommandeService } from '../services/CommandeService';
import { ArticlePanier, Commande } from '../models/Commande';
import { KeycloakService } from '../services/keycloak.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {
  f: FormGroup;
  produitsPanier: ArticlePanier[] = [
    { 
      id: 1, 
      nom: 'Vanilla salted caramel', 
      quantite: 2, 
      prix: 300.00,
    },
    { 
      id: 2, 
      nom: 'German chocolate', 
      quantite: 1, 
      prix: 170.00,
    }
  ];
  totalCommande: number = 0;

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeService,
    private router: Router,
    private keycloak: KeycloakService
  ) {
    this.f = this.fb.group({});
  }

  ngOnInit(): void {

    this.initializeForm();
    this.getPanier();  // Récupérer le panier par défaut depuis le backend
  }
  
  getPanier(): void {
    this.commandeService.getPanier().subscribe((produits: ArticlePanier[]) => {
      this.produitsPanier = produits;
      this.calculerTotal(); // Recalculer le total avec les articles reçus
    });
  }
  

  initializeForm(): void {
    this.f = this.fb.group({
      nomClient: ['', [Validators.required, Validators.minLength(2)]],
      prenomClient: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      adresseClient: ['', [Validators.required, Validators.minLength(5)]],
      codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      notes: ['']
    });
  }

  getControl(controlName: string): AbstractControl | null {
    return this.f.get(controlName);
  }

  calculerTotal(): number {
    this.totalCommande = this.produitsPanier.reduce(
      (total, article) => total + (article.prix * article.quantite), 0
    );
    return this.totalCommande;
  }

  async onSubmit(): Promise<void> {
    try {
      const refreshed = await this.keycloak.updateToken(30);
      if (!refreshed) {
        await this.keycloak.login();
        return;
      }
  
      // ❌ Éviter d'envoyer les `id` des articles
      const cleanedArticles = this.produitsPanier.map(({ nom, prix, quantite }) => ({
        nom,
        prix,
        quantite
      }));
  
      const commandeData = {
        ...this.f.value,
        articlesPanier: cleanedArticles
      };
  
      const response = await lastValueFrom(
        this.commandeService.enregistrerCommande(commandeData)
      );
      const commande = response.body;
      console.log('ID de commande:', commande.id);
      this.router.navigate(['/paiement',commande.id], {
        state: { total: this.totalCommande }
      });    } catch (error) {
      console.error('Error:', error);
      // if (error.status === 401) {
      //   await this.keycloak.login();
      // } else {
      //   alert('Error: ' + error.message);
      // }
    }
  }
  
  
  private markAllAsTouched(): void {
    Object.values(this.f.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}