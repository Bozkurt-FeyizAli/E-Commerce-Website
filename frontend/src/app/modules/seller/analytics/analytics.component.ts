import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  dashboardData: any;
  isLoading = false;
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    //this.fetchDashboard();
  }

  // fetchDashboard(): void {
  //   this.isLoading = true;
  //   this.sellerService.getDashboardData().subscribe({
  //     next: (data) => {
  //       this.dashboardData = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.errorMessage = 'Dashboard verisi yüklenirken hata oluştu.';
  //       this.isLoading = false;
  //     }
  //   });
  // }
}
