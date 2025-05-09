import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole']; // string | string[]
    const userRoles = this.authService.getUserRoles(); // string[]

    if (!userRoles || userRoles.length === 0) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    if (Array.isArray(expectedRole)) {
      return expectedRole.some(role => userRoles.includes(role));
    }

    return userRoles.includes(expectedRole);
  }

}
