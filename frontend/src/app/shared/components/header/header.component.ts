import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    // this.isLoggedIn = this.authService.isLoggedIn();
    // this.isAdmin = this.authService.isAdmin();
  }
  sendToLogin() {
    this.router.navigate(['/login']);
  }
  sendToRegister() {
    this.router.navigate(['/register']);
  }
  sendToHome() {
    this.router.navigate(['/home']);
  }
}
