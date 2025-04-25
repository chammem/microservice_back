import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

interface DashboardStats {
  dailyOrders: Array<{ _id: string; count: number; revenue: number }>;
  popularItems: Array<{ _id: string; count: number; image?: string }>;
  totalRevenue: number;
  commandesStats?: Array<{ _id: string; count: number; totalRevenue: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3005/api/analytics';
  private cache$: any;

  constructor(private http: HttpClient) {}

  getDashboardStats() {
    if (!this.cache$) {
      this.cache$ = interval(5000).pipe(
        switchMap(() => this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`)),
        map(data => ({
          ...data,
          commandesParStatut: data.commandesStats?.map(stat => ({
            statut: this.translateStatus(stat._id),
            count: stat.count,
            revenue: stat.totalRevenue
          })) || []
        })),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  private translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'VALIDEE': 'Validée',
      'PAYE': 'Payée',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return statusMap[status] || status;
  }
}