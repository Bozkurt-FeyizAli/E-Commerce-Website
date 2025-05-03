import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];  // Tek string ya da array olabilir
    const userRole = this.authService.getUserRole();

    if (!userRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(userRole)) {
        return true;
      }
    } else {
      if (userRole === expectedRole) {
        return true;
      }
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
