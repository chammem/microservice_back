import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  private apiUrl = `${environment.apiUrl}/commandes`;
  private commandeData = new BehaviorSubject<any>(null);


 // setCommande(data: any) {
   // this.commandeData.next(data);
  //}

//getCommande() {
  //  return this.commandeData.asObservable();
 // }

  constructor(private http: HttpClient) {}

  createCommande(commande: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, commande);
  }

  getCommande(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
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

  getPanierStatique(): Observable<any> {
    return this.http.get(`${this.apiUrl}/panier-statique`);
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

  enregistrerCommande(commande: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/enregistrer-commande`, commande, { headers });
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
