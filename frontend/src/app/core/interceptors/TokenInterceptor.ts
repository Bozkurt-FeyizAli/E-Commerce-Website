import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {} // ✅ AuthService değil, Injector alıyoruz

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Lazy şekilde AuthService al
    const authService = this.injector.get(AuthService);
    const isAuthRequest = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');

    if (isAuthRequest) {
      return next.handle(req);
    }

    const token = authService.getToken();
    if (token && token.trim() !== '') {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }
}
