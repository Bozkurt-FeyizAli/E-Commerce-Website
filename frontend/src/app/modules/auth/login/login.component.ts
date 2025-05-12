import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  ngAfterViewInit() {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.initialize({
        client_id: '616690897071-bagemhsi4ns0fr6u8gboe7nio5sk6p9h.apps.googleusercontent.com',
        callback: (response: any) => this.handleCredentialResponse(response)
      });
    } else {
      console.warn('Google SDK yüklenmemiş');
    }
  }


  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '616690897071-bagemhsi4ns0fr6u8gboe7nio5sk6p9h.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button'),
      { theme: 'outline', size: 'large', width: 250 }
    );
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;

    this.authService.googleLogin({ idToken }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          const role = this.authService.getPrimaryRole();
          this.router.navigate(
            role === 'ROLE_ADMIN' ? ['/admin'] :
            role === 'ROLE_SELLER' ? ['/seller'] :
            ['/home']
          );
        });
      },
      error: () => {
        this.loginError = 'Google login failed';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        const role = this.authService.getPrimaryRole();
        this.router.navigate(
          role === 'ROLE_ADMIN' ? ['/admin'] :
          role === 'ROLE_SELLER' ? ['/seller'] :
          ['/home']
        );
      },
      error: () => {
        this.loginError = 'Invalid credentials or server error';
      }
    });
  }

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
