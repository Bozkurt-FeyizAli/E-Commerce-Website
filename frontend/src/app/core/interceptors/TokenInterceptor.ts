import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const isAuthRequest = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');

    if (isAuthRequest) {
      // Token ekleme, sadece aynen gönder
      return next.handle(req);
    }

    const token = this.authService.getToken() as string | null;
    if (token && token.trim() !== '') {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
          // DİKKAT: Content-Type'ı burada elle setleme. HttpClient zaten kendi koyuyor.
        }
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }


}
