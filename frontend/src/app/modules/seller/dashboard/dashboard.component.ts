import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any;
  isLoading = false;
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  // ngOnInit(): void {
  //   this.fetchDashboard();
  // }

  ngOnInit(): void {
    //this.loadDashboardData();
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
