import { Component } from '@angular/core';
import { 
  NgApexchartsModule,
  ApexChart,
  ApexResponsive,
  ApexLegend,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];  // Made required
  colors: string[];  // Made required
  responsive: ApexResponsive[];  // Made required
  legend: ApexLegend;  // Made required
}

@Component({
  selector: 'app-apex-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './apex-chart.component.html',
  styleUrls: ['./apex-chart.component.scss']
})
export class ApexChartComponent {
  donutChartOptions: ChartOptions = {
    series: [44, 55, 41, 17, 15],
    chart: {
      type: 'donut',
      height: 350
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    legend: {
      position: 'bottom'
    }
  };
}