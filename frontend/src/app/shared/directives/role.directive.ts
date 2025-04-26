import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Role } from '@models/role.enum.model';
import { AuthService } from 'app/core/services/auth/auth.service';

@Directive({
  selector: '[appRole]',
  standalone: false
})
export class RoleDirective {
  @Input() appRole: Role[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {
    this.updateView();
  }

  private updateView() {
    const hasRole = this.auth.getRoles()
      .map(r => Role[r as keyof typeof Role])
      .some(r => this.appRole.includes(r));
    hasRole ? this.viewContainer.createEmbeddedView(this.templateRef)
            : this.viewContainer.clear();
  }
}
