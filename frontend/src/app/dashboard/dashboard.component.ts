import { AnalyticsService } from '../services/analytics.service';
import { CommonModule, CurrencyPipe , NgIf} from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CurrencyPipe,    MatProgressSpinnerModule ,RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('ordersChart') ordersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productsChart') productsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('commandesChart') commandesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  stats: any;
  private dataSubscription!: Subscription;
  
  charts: {
    orders?: Chart;
    products?: Chart;
    commandes?: Chart;
    revenue?: Chart;
  } = {};

  constructor(private analytics: AnalyticsService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.dataSubscription = this.analytics.getDashboardStats().subscribe({
      next: data => {
        this.stats = data;
        this.renderCharts();
      },
      error: err => console.error('Erreur lors du chargement des données:', err)
    });
  }

  renderCharts() {
    this.destroyCharts();

    if (this.stats?.dailyOrders) {
      this.charts.orders = this.createLineChart(
        this.ordersChartRef.nativeElement,
        'Commandes par jour',
        this.stats.dailyOrders.map(d => d._id),
        this.stats.dailyOrders.map(d => d.count),
        '#3e95cd'
      );
    }

    if (this.stats?.popularItems) {
      this.charts.products = this.createDoughnutChart(
        this.productsChartRef.nativeElement,
        this.stats.popularItems.map(p => p._id),
        this.stats.popularItems.map(p => p.count)
      );
    }

    if (this.stats?.commandesParStatut?.length) {
      this.charts.commandes = this.createBarLineChart(
        this.commandesChartRef.nativeElement,
        this.stats.commandesParStatut.map(c => c.statut),
        this.stats.commandesParStatut.map(c => c.count),
        this.stats.commandesParStatut.map(c => c.revenue)
      );
    }
  }

  private createLineChart(element: HTMLCanvasElement, label: string, labels: string[], data: number[], color: string): Chart {
    return new Chart(element, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: color,
          backgroundColor: `${color}20`,
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  private createDoughnutChart(element: HTMLCanvasElement, labels: string[], data: number[]): Chart {
    return new Chart(element, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Top produits' }
        }
      }
    });
  }

  private createBarLineChart(element: HTMLCanvasElement, labels: string[], barData: number[], lineData: number[]): Chart {
    return new Chart(element, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Commandes par statut',
            data: barData,
            backgroundColor: '#4bc0c0'
          },
          {
            label: 'Revenue (€)',
            data: lineData,
            backgroundColor: '#9966ff',
            type: 'line',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Nombre de commandes' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Revenue (€)' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  private destroyCharts() {
    Object.values(this.charts).forEach(chart => chart?.destroy());
    this.charts = {};
  }

  ngOnDestroy() {
    this.destroyCharts();
    this.dataSubscription?.unsubscribe();
  }
}