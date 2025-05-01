import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { User } from '@model/user';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Partial<User> = {};
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    // Normalde burada mevcut profil verisi çekilir; basit tutuyorum.
  }

  updateProfile(): void {
    this.isLoading = true;
    this.sellerService.updateProfile(this.profile).subscribe({
      next: (data) => {
        this.successMessage = 'Profil başarıyla güncellendi.';
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Profil güncellenirken hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  changePassword(oldPassword: string, newPassword: string): void {
    this.sellerService.changePassword({ oldPassword, newPassword }).subscribe({
      next: () => {
        this.successMessage = 'Şifre başarıyla değiştirildi.';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Şifre değiştirilirken hata oluştu.';
      }
    });
  }
}
