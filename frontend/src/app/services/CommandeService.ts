import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { KeycloakService } from './keycloak.service';
import { ArticlePanier, Commande } from '../models/Commande';
import { firstValueFrom } from 'rxjs'; // Ajoutez cette importation
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { switchMap,tap } from 'rxjs/operators';  // Import switchMap operator
import { Observable, from } from 'rxjs';  // Import 'from' to convert Promise → Observable
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class CommandeService {
  private apiUrl = `${environment.apiUrl}/commandes`;
  private commandeData = new BehaviorSubject<any>(null);


 // setCommande(data: any) {
   // this.commandeData.next(data);
  //}

//getCommande() {
  //  return this.commandeData.asObservable();
 // }

  constructor(private http: HttpClient,    private keycloak: KeycloakService
  ) {}

  private async getAuthHeader(): Promise<any> {
    const token = await this.keycloak.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }
  createCommande(commande: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, commande);
  }

  getCommande(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes/${id}`);
  }

  getAllCommandes(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  updateStatutCommande(id: number, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/statut?statut=${statut}`, {});
  }

  deleteCommande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  calculerTotalPanier(panier: any[]): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/calculer-total`, panier);
  }

  validerCommande(panier: any[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/valider-commande`, panier);
  }

  traiterPaiement(montant: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/traiter-paiement?montant=${montant}`, {});
  }

  getPanier(): Observable<ArticlePanier[]> {
    return this.http.get<ArticlePanier[]>('http://localhost:8093/commandes/panier-statique');
  }
  
  
 // commande.service.ts
 enregistrerCommande(commande: any): Observable<any> {
  return from(this.keycloak.getToken()).pipe(
    switchMap(token => {
      if (!token) throw new Error('Aucun token disponible');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,  // Ajoutez les guillemets autour de Bearer
        'Content-Type': 'application/json'
      });

      return this.http.post(
        'http://localhost:8093/commandes/enregistrer-commande',
        commande,
        { headers, observe: 'response' }
      ).pipe(
        catchError(error => {
          if (error.status === 401) {
            this.keycloak.login();
          }
          throw error;
        })
      );
    })
  );
}

private handleError(error: any): void {
    if (error.status === 403) {
        alert('Permission refusée - Vous devez être connecté');
    } else  if (error.status === 401) {
      this.keycloak.login(); // Rediriger vers login si token invalide
    } else {
        console.error('Erreur technique:', error);
        alert('Erreur technique - Veuillez réessayer');
    }
}

  mettreAJourHistorique(commande: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mettre-a-jour-historique`, commande);
  }

  passerCommande(nomClient: string, adresseClient: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/passer-commande`, null, {
      params: {
        nomClient,
        adresseClient,
      },
    });
  }

  private produitsSource = new BehaviorSubject<any[]>([]);
  produits$ = this.produitsSource.asObservable();

  setProduits(produits: any[]): void {
    this.produitsSource.next(produits);
  }

  getProduits(): Observable<any[]> {
    return this.produits$;
  }
}
