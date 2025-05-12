import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[]; // 👈 dikkat
    const userRoles = this.authService.getUserRoles();

    console.log('🛡️ Guard Kontrol:', { expectedRoles, userRoles });

    if (!userRoles.length) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    const matched = expectedRoles.some(role => userRoles.includes(role));
    if (!matched) this.router.navigate(['/unauthorized']);
    return matched;
  }



}
