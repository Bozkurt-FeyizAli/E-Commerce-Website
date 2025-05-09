import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        console.log('✅ Login başarılı');

        const role = this.authService.getPrimaryRole();
        console.log('🎯 Rol kontrolü sonrası yönlendirme:', role);

        // ✅ Rol bazlı yönlendirme
        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'ROLE_SELLER') {
          this.router.navigate(['/seller']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('❌ Login hatası:', err);
        this.loginError = 'Invalid credentials or server error';
      }
    });
  }

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
