import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuItem } from '../models/menu-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menus`; // URL de l'API pour récupérer les menus

  constructor(private http: HttpClient) {}
  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Méthode simplifiée pour obtenir les en-têtes d'authentification
  private getAuthHeader(): { headers: HttpHeaders } {
    const token = 'votre_token';  // Token statique ou récupéré d'une autre source
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // Méthode pour récupérer tous les menus
  getMenus(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl, this.getAuthHeader()).pipe(
      catchError(err => {
        console.error('Erreur lors de la récupération des menus', err);
        return throwError(() => err); // Renvoi d'une erreur si l'API échoue
      })
    );
  }

  // Méthode pour récupérer un menu par son ID
  getMenuById(id: number): Observable<MenuItem> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<MenuItem>(url, this.getAuthHeader()).pipe(
      catchError(err => {
        console.error(`Erreur lors de la récupération du menu avec ID ${id}`, err);
        return throwError(() => err); // Renvoi d'une erreur si l'API échoue
      })
    );
  }

  // Méthode pour mettre à jour un menu
  updateMenu(id: number, menu: MenuItem): Observable<MenuItem> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<MenuItem>(url, menu, this.getAuthHeader()).pipe(
      catchError(err => {
        console.error(`Erreur lors de la mise à jour du menu avec ID ${id}`, err);
        return throwError(() => err);
      })
    );
  }

  // Méthode pour créer un nouveau menu
  createMenu(menu: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl, menu, this.getAuthHeader()).pipe(
      catchError(err => {
        console.error('Erreur lors de la création du menu', err);
        return throwError(() => err);
      })
    );
  }

  // Méthode pour actualiser les menus dans le BehaviorSubject (si vous avez besoin de stocker dans un état local)
  refreshMenus(): void {
    this.getMenus().subscribe({
      next: menus => console.log('Menus récupérés:', menus),
      error: err => console.error('Erreur dans refreshMenus', err)
    });
  }
}
