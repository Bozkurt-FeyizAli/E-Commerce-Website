import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  contractUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/contracts/latest`).subscribe((res: any) => {
      this.contractUrl = res.url; // PDF URL string olarak
    });


    // Google register
    google.accounts.id.initialize({
      client_id: '616690897071-bagemhsi4ns0fr6u8gboe7nio5sk6p9h.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-register-button'),
      { theme: 'outline', size: 'large', width: 250 }
    );
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;
    this.authService.googleRegister({ idToken }).subscribe({
      next: (res: any) => {
        const { accessToken, refreshToken, user } = res;
        this.authService.saveToken(accessToken);
        this.authService.saveUser(user);
        this.authService.loadCurrentUser();

        this.ngZone.run(() => this.router.navigate(['/home']));
      },
      error: err => console.error('Google signup failed', err)
    });

  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register({ username, email, password }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => console.error('Registration failed:', err)
      });
    }
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { notEqual: true };
  }

  get confirmPasswordError(): string {
    const errors = this.registerForm.get('confirmPassword')?.errors;
    if (errors?.['required']) return 'Confirm Password is required';
    if (errors?.['notEqual']) return 'Passwords must match';
    return '';
  }

  openContract(): void {
    if (this.contractUrl) {
      window.open(this.contractUrl as string, '_blank');
    }
  }

}
