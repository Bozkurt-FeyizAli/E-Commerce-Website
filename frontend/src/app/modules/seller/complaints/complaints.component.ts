import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Complaint } from '@model/complaint';

@Component({
  selector: 'app-complaints',
  standalone: false,
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.fetchComplaints();
  }

  fetchComplaints(): void {
    this.isLoading = true;
    this.sellerService.getMyComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Şikayetler yüklenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }
}
