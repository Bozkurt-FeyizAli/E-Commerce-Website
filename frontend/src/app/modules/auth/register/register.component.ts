import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the reactive form
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      // terms is frontend-only, will not be sent to backend
      terms: new FormControl(false, Validators.requiredTrue),
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const dataToSend = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };
      console.log('Sending data:', dataToSend); // DEBUG

      this.authService.register(dataToSend).subscribe({
        next: (res) => {
          console.log('Registration successful:', res);
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
        }
      });
      this.router.navigate(['login']);
    } else {
      console.log('Form is invalid');
    }
  }


  // Custom validator to check if passwords match
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notEqual: true };
  }

  get confirmPasswordError() {
    const errors = this.registerForm.get('confirmPassword')?.errors;
    if (errors?.['required']) {
      return 'Confirm Password is required';
    }
    if (errors?.['notEqual']) {
      return 'Passwords must match';
    }
    return '';
  }
}
