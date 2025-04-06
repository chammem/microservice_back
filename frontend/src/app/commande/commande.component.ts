import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommandeService } from '../services/CommandeService';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {
  f!: FormGroup;
  totalCommande: number = 0;
  produits = [
    { nom: 'Vanilla salted caramel', prix: 300.00 },
    { nom: 'German chocolate', prix: 170.00 },
    { nom: 'Sweet autumn', prix: 170.00 },
    { nom: 'Gluten free mini dozen', prix: 110.00 }
  ];

  constructor(private fb: FormBuilder,
    private commandeService: CommandeService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.f = this.fb.group({
      nomClient: ['', Validators.required],
      prenomClient: ['', Validators.required],
      adresseClient: ['', Validators.required],
      codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      notes: ['']
    });

    this.calculerTotal();

    // Détection des changements et affichage des valeurs en console
    this.f.valueChanges.subscribe(val => {
      console.log('Valeurs du formulaire:', val);
      console.log('Statut du formulaire:', this.f.valid ? '✅ Valide' : '❌ Invalide');
    });
  }

  calculerTotal(): void {
    this.totalCommande = this.produits.reduce((total, produit) => total + produit.prix, 0);
  }

  onSubmit(): void {
    if (this.f.valid) {
      const commande = {
        nomClient: this.f.value.nomClient,
        prenomClient: this.f.value.prenomClient,
        adresseClient: this.f.value.adresseClient,
        codePostal: this.f.value.codePostal,
        telephone: this.f.value.telephone,
        email: this.f.value.email,
        notes: this.f.value.notes,
        totalCommande: this.totalCommande,
        produits: this.produits, // Ajouter les produits dans la commande
      };
      
      this.commandeService.enregistrerCommande(commande).subscribe(
        (response: any) => {
          if (response && response.id) {
            console.log('Commande enregistrée avec succès:', response);
            alert('Votre commande a été passée avec succès !');
            this.commandeService.setProduits(this.produits);

            this.router.navigate(['/confirmation', response.id]);
          } else {
            console.error('Réponse inattendue du serveur:', response);
            alert('Erreur lors de la validation de la commande.');
          }
        })
      }
  }
  
}
