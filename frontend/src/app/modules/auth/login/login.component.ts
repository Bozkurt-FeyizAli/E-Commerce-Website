import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    // Initialize the reactive form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],  // email validation
      password: ['', Validators.required]  // password required
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);  // Save the token to localStorage
            this.router.navigate(['/home']);  // Redirect to the home page
          } else {
            alert('Login failed');
          }
        },
        error: () => {
          alert('Login failed');
        }
      });
    }
  }

  // Redirect to the registration page
  onRegister() {
    this.router.navigate(['auth/register']);
  }
}
