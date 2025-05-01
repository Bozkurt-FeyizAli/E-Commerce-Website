import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { SessionService } from 'app/core/services/session/session.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sessionService: SessionService,  // ✅ EKLENDİ
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: { token: string; user: any }) => {
          console.log('Login başarılı:', response);

          // ✅ TOKEN ve USER SESSION’A KAYDEDİLİYOR
          this.sessionService.saveToken(response.token);
          this.sessionService.save('user', response.user);  // opsiyonel: backend user dönerse

          // Başarıyla giriş → yönlendir
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          console.error('Login failed:', err);
          alert('Login failed');
        }
      });
    }
  }

  onRegister() {
    this.router.navigate(['auth/register']);
  }
}
