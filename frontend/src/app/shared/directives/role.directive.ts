import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'app/core/services/auth/auth.service';

@Directive({
  standalone: false,
  selector: '[appHasRole]'
})
export class RoleDirective {
  @Input() set appHasRole(role: string) {
    const userRole = this.authService.getUserRole();
    if (Array.isArray(userRole) && userRole.includes(role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}
}
